# Student Resources - Downloads Folder

This folder contains all downloadable reading materials for students.

## Structure

```
downloads/
└── resources/
    ├── introduction-to-devops.pdf
    ├── kubernetes-deep-dive.pdf
    ├── cicd-best-practices.pdf
    ├── cloud-architecture-patterns.pdf
    ├── python-for-devops.pdf
    └── docker-containerization.pdf
```

## How to Add Files

1. Place your PDF files in this `resources/` folder
2. Update the materials data in `StudentResources.jsx` with:
   - File title
   - Category
   - Description
   - File size
   - Download link: `/downloads/resources/filename.pdf`

## File Guidelines

- **Recommended Format**: PDF
- **Max File Size**: 10 MB
- **Naming Convention**: Use lowercase, hyphens, no spaces
  - ✅ Good: `introduction-to-devops.pdf`
  - ❌ Bad: `Introduction To DevOps.pdf`

## Example Material Entry

```javascript
{
  id: 1,
  title: 'Introduction to DevOps',
  category: 'DevOps',
  description: 'Comprehensive guide covering DevOps principles, tools, and best practices.',
  fileSize: '2.5 MB',
  fileType: 'PDF',
  downloadLink: '/downloads/resources/introduction-to-devops.pdf'
}
```

