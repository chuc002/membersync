export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class FormValidator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []
    
    if (!email) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []
    
    if (!password) {
      errors.push('Password is required')
    } else {
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long')
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
    const errors: string[] = []
    
    if (!confirmPassword) {
      errors.push('Password confirmation is required')
    } else if (password !== confirmPassword) {
      errors.push('Passwords do not match')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = []
    
    if (phone) {
      // Remove all non-digit characters for validation
      const digits = phone.replace(/\D/g, '')
      
      if (digits.length < 10) {
        errors.push('Phone number must be at least 10 digits')
      } else if (digits.length > 11) {
        errors.push('Phone number is too long')
      } else if (digits.length === 11 && !digits.startsWith('1')) {
        errors.push('11-digit phone numbers must start with 1')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validateName(name: string): ValidationResult {
    const errors: string[] = []
    
    if (!name) {
      errors.push('Name is required')
    } else if (name.length < 2) {
      errors.push('Name must be at least 2 characters long')
    } else if (name.length > 100) {
      errors.push('Name is too long')
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
      errors.push('Name can only contain letters, spaces, hyphens, apostrophes, and periods')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validateAge(age: number): ValidationResult {
    const errors: string[] = []
    
    if (age < 0) {
      errors.push('Age cannot be negative')
    } else if (age > 150) {
      errors.push('Please enter a valid age')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validateFamilyMember(member: {
    name: string
    age: number
    relationship: string
  }): ValidationResult {
    const errors: string[] = []
    
    const nameValidation = this.validateName(member.name)
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors)
    }
    
    const ageValidation = this.validateAge(member.age)
    if (!ageValidation.isValid) {
      errors.push(...ageValidation.errors)
    }
    
    if (!member.relationship) {
      errors.push('Relationship is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validateSignupForm(data: {
    email: string
    password: string
    confirmPassword: string
    fullName: string
    phoneNumber?: string
  }): ValidationResult {
    const errors: string[] = []
    
    const emailValidation = this.validateEmail(data.email)
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors)
    }
    
    const passwordValidation = this.validatePassword(data.password)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }
    
    const confirmPasswordValidation = this.validatePasswordConfirmation(data.password, data.confirmPassword)
    if (!confirmPasswordValidation.isValid) {
      errors.push(...confirmPasswordValidation.errors)
    }
    
    const nameValidation = this.validateName(data.fullName)
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors)
    }
    
    if (data.phoneNumber) {
      const phoneValidation = this.validatePhoneNumber(data.phoneNumber)
      if (!phoneValidation.isValid) {
        errors.push(...phoneValidation.errors)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static validateLoginForm(data: {
    email: string
    password: string
  }): ValidationResult {
    const errors: string[] = []
    
    if (!data.email) {
      errors.push('Email is required')
    }
    
    if (!data.password) {
      errors.push('Password is required')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  
  return phone // Return original if format is unknown
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}