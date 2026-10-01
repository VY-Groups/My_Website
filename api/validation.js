import { z } from 'zod';

// Email validation with strict rules
const emailSchema = z.string()
  .trim()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .email('Invalid email address')
  .refine((email) => {
    // Block disposable email domains
    const disposableDomains = [
      'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
      'yopmail.com', 'sharklasers.com', 'trashmail.com', 'fakeinbox.com',
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    return !disposableDomains.includes(domain);
  }, 'Disposable email addresses are not allowed');

// Name validation
const nameSchema = z.string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Message validation (contact form)
const messageSchema = z.string()
  .trim()
  .min(10, 'Message must be at least 10 characters')
  .max(5000, 'Message must be less than 5000 characters');

// Contact form schema
export const contactFormSchema = z.object({
  type: z.literal('contact').optional(),
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

// Collaboration form schema
export const collaborationFormSchema = z.object({
  type: z.literal('collaboration'),
  companyName: z.string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be less than 200 characters'),
  name: nameSchema,
  email: emailSchema,
  requestType: z.string()
    .trim()
    .min(1, 'Request type is required')
    .max(100, 'Request type must be less than 100 characters'),
  briefDetail: z.string()
    .trim()
    .min(20, 'Brief details must be at least 20 characters')
    .max(5000, 'Brief details must be less than 5000 characters'),
  services: z.array(z.string())
    .min(1, 'At least one service is required')
    .max(10, 'Maximum 10 services'),
  budget: z.string()
    .trim()
    .max(100, 'Budget must be less than 100 characters')
    .optional(),
  preferredTech: z.array(z.string())
    .max(10, 'Maximum 10 technologies')
    .optional(),
});

// Validate based on type
export function validateFormData(body) {
  if (body?.type === 'collaboration') {
    const result = collaborationFormSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`);
      return { success: false, errors };
    }
    return { success: true, data: result.data };
  }

  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`);
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}