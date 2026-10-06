// Real certifications held by the site owner — images live in /public/certificates/
// (optimized copies; original scans are kept out of the repo).
// `thumb` = 800w card preview, `image` = full-size lightbox view.

const base = '/certificates/'

export const certifications = [
  {
    id: 'aws-cloud-practitioner',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issued: 'Sep 2024',
    expires: 'Sep 2027',
    credentialId: '6d23126b1f014bc5bf6e375e502bd04a',
    verifyUrl: 'https://aws.amazon.com/verification',
    status: 'Verified',
    image: base + 'aws-cloud-practitioner.jpg',
    thumb: base + 'aws-cloud-practitioner-thumb.jpg',
    seal: base + 'aws-cloud-practitioner-badge.webp',
    featured: true,
  },
  {
    id: 'tws-github-actions-deploy',
    title: 'Three Tier-Application Deployment With GitHub Actions',
    issuer: 'Train With Shubham',
    issued: 'Oct 2026',
    status: 'Completed',
    detail: 'Hands-on course',
    credentialId: 'PA0ZIAK2',
    image: base + 'tws-github-actions-deploy.jpg',
    thumb: base + 'tws-github-actions-deploy-thumb.jpg',
  },
  {
    id: 'iraje-pam-masterclass',
    title: 'PAM Online Masterclass',
    issuer: 'Iraje Software',
    issued: 'Sep 2026',
    status: 'Completed',
    detail: '10 sessions · 20 hrs',
    image: base + 'iraje-pam-masterclass.jpg',
    thumb: base + 'iraje-pam-masterclass-thumb.jpg',
  },
  {
    id: 'udemy-git-github',
    title: 'Hands-On Introduction to Git with GitHub',
    issuer: 'Udemy',
    issued: 'Jan 2026',
    status: 'Completed',
    image: base + 'udemy-git-github.jpg',
    thumb: base + 'udemy-git-github-thumb.jpg',
  },
  {
    id: 'udemy-aws-clf-c02',
    title: 'Ultimate AWS Certified Cloud Practitioner CLF-C02',
    issuer: 'Udemy',
    issued: 'Jul 2024',
    status: 'Completed',
    image: base + 'udemy-aws-clf-c02.jpg',
    thumb: base + 'udemy-aws-clf-c02-thumb.jpg',
  },
  {
    id: 'redhat-rh199',
    title: 'RHCSA Rapid Track (RH199)',
    issuer: 'Red Hat',
    issued: 'Dec 2022',
    status: 'Attended',
    detail: '40 credit hours',
    image: base + 'rhcsa-rh199-attendance.jpg',
    thumb: base + 'rhcsa-rh199-attendance-thumb.jpg',
  },
]
