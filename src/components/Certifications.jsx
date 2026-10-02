import React, { useState, useEffect, useRef } from 'react'
import { FiCheckCircle, FiMaximize2, FiX, FiExternalLink } from 'react-icons/fi'
import { certifications } from '../data/certifications'
import './Certifications.css'

export default function Certifications() {
  const [active, setActive] = useState(null)
  const closeBtnRef = useRef(null)
  const lastFocused = useRef(null)

  const openCert = (index) => {
    lastFocused.current = document.activeElement
    setActive(index)
  }

  const closeCert = () => {
    setActive(null)
    if (lastFocused.current && typeof lastFocused.current.focus === 'function') {
      lastFocused.current.focus()
    }
  }

  useEffect(() => {
    if (active === null) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCert()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const activeCert = active !== null ? certifications[active] : null

  return (
    <section className="certifications" id="certifications">
      <div className="container">
        <h2 className="section-title">Certifications</h2>
        <p className="cert-subtitle">
          Verified credentials across cloud, Linux, version control and privileged access management.
        </p>

        <div className="cert-grid">
          {certifications.map((cert, index) => (
            <article
              key={cert.id}
              className={`cert-card${cert.featured ? ' cert-card-featured' : ''}`}
            >
              <button
                type="button"
                className="cert-thumb"
                onClick={() => openCert(index)}
                aria-label={`View ${cert.title} certificate`}
              >
                <img
                  src={cert.thumb || cert.image}
                  alt={`${cert.title} certificate — ${cert.issuer}`}
                  loading="lazy"
                  decoding="async"
                  width="1400"
                  height="1050"
                />
                <span className="cert-zoom" aria-hidden="true">
                  <FiMaximize2 size={14} /> View
                </span>
                {cert.seal && (
                  <img className="cert-seal" src={cert.seal} alt="" aria-hidden="true" />
                )}
              </button>

              <div className="cert-body">
                <div className="cert-meta">
                  <span className="cert-issuer">{cert.issuer}</span>
                  <span
                    className={`cert-status${cert.verifyUrl ? ' cert-status-verified' : ''}`}
                  >
                    {cert.verifyUrl && <FiCheckCircle size={12} aria-hidden="true" />}
                    {cert.status}
                  </span>
                </div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-dates">
                  Issued {cert.issued}
                  {cert.expires ? ` · Valid till ${cert.expires}` : ''}
                  {cert.detail ? ` · ${cert.detail}` : ''}
                </p>
                <div className="cert-actions">
                  <button
                    type="button"
                    className="cert-action"
                    onClick={() => openCert(index)}
                  >
                    View certificate
                  </button>
                  {cert.verifyUrl && (
                    <a
                      className="cert-action cert-action-verify"
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify <FiExternalLink size={12} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeCert && (
        <div
          className="cert-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCert.title} certificate`}
          onClick={closeCert}
        >
          <div
            className="cert-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              ref={closeBtnRef}
              className="cert-lightbox-close"
              onClick={closeCert}
              aria-label="Close certificate"
            >
              <FiX size={22} />
            </button>
            <img
              className="cert-lightbox-img"
              src={activeCert.image}
              alt={`${activeCert.title} certificate — ${activeCert.issuer}`}
            />
            <div className="cert-lightbox-caption">
              <span>
                <strong>{activeCert.title}</strong>
                {' — '}
                {activeCert.issuer} · {activeCert.issued}
              </span>
              {activeCert.credentialId && (
                <code className="cert-lightbox-id">ID: {activeCert.credentialId}</code>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
