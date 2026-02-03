// Student Resources API Data
// Store your materials data here and import in StudentResources.jsx

const studentMaterials = [
  {
    id: 1,
    title: 'Introduction to DevOps',
    category: 'DevOps',
    description: 'Comprehensive guide covering DevOps principles, tools, and best practices.',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    downloadLink: '/downloads/resources/introduction-to-devops.pdf'
  },
  {
    id: 2,
    title: 'Kubernetes Deep Dive',
    category: 'Kubernetes',
    description: 'Advanced Kubernetes concepts including networking, storage, and security.',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    downloadLink: '/downloads/resources/kubernetes-deep-dive.pdf'
  },
  {
    id: 3,
    title: 'CI/CD Pipeline Best Practices',
    category: 'DevOps',
    description: 'Learn how to design and implement efficient CI/CD pipelines.',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    downloadLink: '/downloads/resources/cicd-best-practices.pdf'
  },
  {
    id: 4,
    title: 'Cloud Architecture Patterns',
    category: 'Cloud',
    description: 'Design patterns for scalable and resilient cloud applications.',
    fileSize: '2.2 MB',
    fileType: 'PDF',
    downloadLink: '/downloads/resources/cloud-architecture-patterns.pdf'
  },
  {
    id: 5,
    title: 'Python for DevOps Engineers',
    category: 'Programming',
    description: 'Essential Python skills for DevOps automation and scripting.',
    fileSize: '1.9 MB',
    fileType: 'PDF',
    downloadLink: '/downloads/resources/python-for-devops.pdf'
  },
  {
    id: 6,
    title: 'Docker & Containerization',
    category: 'DevOps',
    description: 'Complete guide to Docker, containerization, and container orchestration.',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    downloadLink: '/downloads/resources/docker-containerization.pdf'
  }
];

module.exports = { studentMaterials };
