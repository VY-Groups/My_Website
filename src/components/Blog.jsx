import React, { useState, useMemo, useEffect } from 'react'
import { FiArrowLeft, FiClock, FiTag, FiBookOpen, FiSearch } from 'react-icons/fi'
import './Blog.css'
import { trackEvent } from './Analytics'

// Discover all MDX posts at build time — metadata only for the listing;
// full post content loads as its own chunk when opened (keeps this chunk small)
const postMetaLoaders = import.meta.glob('../blog/*.mdx', { import: 'meta' })
const postLoaders = import.meta.glob('../blog/*.mdx')

export default function Blog() {
  const [activePost, setActivePost] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const [posts, setPosts] = useState(null)
  const [loadersBySlug, setLoadersBySlug] = useState(() => new Map())
  const [PostContent, setPostContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)

  // Load frontmatter (tiny) for the listing
  useEffect(() => {
    let cancelled = false
    Promise.all(
      Object.entries(postMetaLoaders).map(([path, load]) =>
        load()
          .then((meta) => ({ path, meta }))
          .catch(() => null)
      )
    ).then((items) => {
      if (cancelled) return
      const valid = items
        .filter((item) => item && item.meta && item.meta.slug)
        .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
      setPosts(valid.map((item) => item.meta))
      setLoadersBySlug(new Map(valid.map((item) => [item.meta.slug, postLoaders[item.path]])))
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Build tag list
  const tags = useMemo(() => {
    const set = new Set()
    ;(posts || []).forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return ['all', ...Array.from(set)]
  }, [posts])

  const filteredPosts = useMemo(() => {
    let result = posts || []
    if (activeTag !== 'all') {
      result = result.filter((p) => p.tags?.includes(activeTag))
    }
    const q = searchTerm.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchTerm, activeTag, posts])

  // Load full post content when opened (per-post dynamic chunk)
  useEffect(() => {
    if (!activePost) {
      setPostContent(null)
      setContentLoading(false)
      return undefined
    }
    const loader = loadersBySlug.get(activePost)
    if (!loader) {
      setPostContent(null)
      setContentLoading(false)
      return undefined
    }
    let cancelled = false
    setContentLoading(true)
    setPostContent(null)
    loader()
      .then((mod) => {
        if (cancelled) return
        setPostContent(() => mod.default || null)
        setContentLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setPostContent(null)
        setContentLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activePost, loadersBySlug])

  const openPost = (slug) => {
    setActivePost(slug)
    trackEvent('blog_read', { post: slug })
    window.location.hash = `blog-${slug}`
  }

  const closePost = () => {
    setActivePost(null)
    window.location.hash = 'blog'
  }

  // Support deep links like #blog-slug
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash.startsWith('blog-')) {
        setActivePost(hash.replace('blog-', ''))
      } else if (hash === 'blog') {
        setActivePost(null)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return (
    <section className="blog" id="blog">
      <div className="container">
        {!activePost ? (
          <>
            <h2 className="section-title">Blog</h2>
            <p className="section-subtitle">
              Practical DevOps, Cloud, and Linux write-ups from real-world experience
            </p>

            {/* Search */}
            <div className="blog-search">
              <FiSearch className="blog-search-icon" aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search blog posts"
              />
            </div>

            {/* Tag filter */}
            <div className="blog-tags" role="group" aria-label="Filter posts by tag">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-btn ${activeTag === tag ? 'active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={activeTag === tag}
                >
                  {tag === 'all' ? 'All' : tag}
                </button>
              ))}
            </div>

            {posts === null ? (
              <div className="empty-state" role="status">
                <FiBookOpen size={48} />
                <h3>Loading posts…</h3>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="empty-state" role="status">
                <FiBookOpen size={48} />
                <h3>No Posts Found</h3>
                <p>Try a different search term or tag.</p>
              </div>
            ) : (
              <div className="blog-grid">
                {filteredPosts.map((post) => (
                  <article key={post.slug} className="blog-card">
                    <div className="blog-card-meta">
                      <span className="blog-category">{post.category}</span>
                      <span className="blog-date">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-reading-time">
                        <FiClock size={14} /> {post.readingTime} min read
                      </span>
                      <button className="blog-read-btn" onClick={() => openPost(post.slug)}>
                        Read <FiArrowLeft className="flip" size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <article className="blog-post">
            <button className="blog-back" onClick={closePost}>
              <FiArrowLeft size={16} /> Back to all posts
            </button>
            {PostContent ? (
              <div className="blog-post-content">
                <PostContent />
              </div>
            ) : contentLoading || posts === null ? (
              <div className="empty-state" role="status">
                <h3>Loading post…</h3>
              </div>
            ) : (
              <div className="empty-state" role="status">
                <h3>Post not found</h3>
                <button className="filter-btn" onClick={closePost}>
                  Back to blog
                </button>
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  )
}