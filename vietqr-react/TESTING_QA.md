# Testing & Quality Assurance Documentation

## Overview
Comprehensive testing and quality assurance system with error boundaries, loading states, form validation, accessibility features, and error logging.

---

## 1. Error Boundaries

### Global Error Boundary
Catches JavaScript errors anywhere in the component tree and displays fallback UI.

```jsx
import ErrorBoundary from './components/molecules/ErrorBoundary';

// Wrap your app or components
<ErrorBoundary
  title="Oops! Something went wrong"
  message="An unexpected error occurred"
  showDetails={process.env.NODE_ENV === 'development'}
  onError={(error, errorInfo) => {
    // Log to external service
    console.error('Error:', error, errorInfo);
  }}
  onReset={() => {
    // Reset app state
    window.location.reload();
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Section Error Boundary
Lightweight error boundary for specific sections:

```jsx
import { ErrorBoundarySection } from './components/molecules/ErrorBoundary';

<ErrorBoundarySection onError={(error) => console.error(error)}>
  <SpecificSection />
</ErrorBoundarySection>
```

### Features
- ✅ Automatic error catching
- ✅ Custom fallback UI
- ✅ Error details display (development mode)
- ✅ Reset functionality
- ✅ External error logging support
- ✅ Component stack trace

---

## 2. Loading States

### Available Components

#### 1. Spinner
Rotating loading indicator:
```jsx
import { Spinner } from './components/molecules/LoadingStates';

<Spinner size="small" />  // 20px
<Spinner size="medium" /> // 32px (default)
<Spinner size="large" />  // 48px
<Spinner color="#007bff" />
```

#### 2. Dots Loader
Animated dots loading indicator:
```jsx
import { DotsLoader } from './components/molecules/LoadingStates';

<DotsLoader size="medium" color="#007bff" />
```

#### 3. Progress Bar
Linear progress indicator:
```jsx
import { ProgressBar } from './components/molecules/LoadingStates';

<ProgressBar progress={50} />
<ProgressBar progress={0} indeterminate /> // Indeterminate mode
<ProgressBar 
  progress={75} 
  color="#28a745"
  height="6px"
  maxWidth="400px"
/>
```

#### 4. Skeleton Loaders
Content placeholders:
```jsx
import { 
  SkeletonBox, 
  SkeletonCircle, 
  SkeletonText, 
  SkeletonCard 
} from './components/molecules/LoadingStates';

<SkeletonBox width="100%" height="20px" />
<SkeletonCircle size="40px" />
<SkeletonText lines={3} gap="12px" />
<SkeletonCard withAvatar />
```

#### 5. Full Page Loader
Full-screen loading overlay:
```jsx
import { FullPageLoader } from './components/molecules/LoadingStates';

{isLoading && <FullPageLoader message="Loading data..." />}
```

#### 6. Overlay Loader
Relative positioned overlay:
```jsx
import { OverlayLoader } from './components/molecules/LoadingStates';

<div style={{ position: 'relative', minHeight: '200px' }}>
  {isLoading && <OverlayLoader message="Processing..." />}
  <YourContent />
</div>
```

---

## 3. Form Validation

### Using the Form Validation Hook

```jsx
import { useFormValidation, validators, getFieldProps } from './utils/formValidation';

const MyForm = () => {
  const validationSchema = {
    email: [validators.required, validators.email],
    phone: [validators.required, validators.phone],
    amount: [
      validators.required,
      validators.number,
      validators.min(1000),
      validators.max(100000000)
    ],
  };

  const formState = useFormValidation(
    { email: '', phone: '', amount: '' },
    validationSchema
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    formState.handleSubmit((values) => {
      console.log('Valid form data:', values);
      // Submit to API
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        {...getFieldProps(formState, 'email')}
        type="email"
      />
      {formState.touched.email && formState.errors.email && (
        <span>{formState.errors.email}</span>
      )}
      
      <button type="submit" disabled={formState.isSubmitting}>
        Submit
      </button>
    </form>
  );
};
```

### Available Validators

#### Basic Validators
- `validators.required(value, message)`
- `validators.minLength(min, message)`
- `validators.maxLength(max, message)`

#### Format Validators
- `validators.email(value, message)`
- `validators.phone(value, message)` - Vietnamese phone numbers
- `validators.contractNumber(value, message)` - 6-12 digits
- `validators.url(value, message)`
- `validators.pattern(regex, message)`

#### Number Validators
- `validators.number(value, message)`
- `validators.min(minValue, message)`
- `validators.max(maxValue, message)`
- `validators.range(min, max, message)`

#### Date Validators
- `validators.date(value, message)`
- `validators.pastDate(value, message)`
- `validators.futureDate(value, message)`

#### File Validators
- `validators.fileSize(maxSizeMB, message)`
- `validators.fileType(allowedTypes, message)`

#### Other Validators
- `validators.matches(otherValue, message)` - Field matching (password confirmation)
- `validators.arrayLength(min, max, message)`
- `validators.custom(validatorFn, message)`

### Composing Validators

```jsx
import { composeValidators, validators } from './utils/formValidation';

const passwordValidator = composeValidators(
  validators.required,
  validators.minLength(8),
  validators.pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Must contain uppercase, lowercase, and number'
  )
);
```

### Pre-built Schemas

```jsx
import { commonSchemas } from './utils/formValidation';

// Login form
const loginSchema = commonSchemas.login;

// Registration form
const registerSchema = commonSchemas.register;

// Contract form
const contractSchema = commonSchemas.contract;

// Profile form
const profileSchema = commonSchemas.profile;
```

---

## 4. Accessibility Features

### Focus Management

```jsx
import { useFocusTrap, useFocusManagement } from './utils/accessibilityUtils';

// Focus trap for modals
const MyModal = ({ isOpen }) => {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, isOpen);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <button>Close</button>
      <input type="text" />
    </div>
  );
};

// Focus memory (save and restore)
const focusMemory = useFocusManagement();
// Focus automatically restored on unmount
```

### Keyboard Navigation

```jsx
import { useKeyboardNavigation } from './utils/accessibilityUtils';

const MyMenu = ({ items, onSelect }) => {
  const { activeIndex, handleKeyDown } = useKeyboardNavigation(
    items,
    onSelect,
    {
      loop: true,
      orientation: 'vertical',
    }
  );

  return (
    <div role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="menuitem"
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};
```

### ARIA Announcer

```jsx
import { announce } from './utils/accessibilityUtils';

// Announce to screen readers
announce('Form submitted successfully!', 'polite');
announce('Error occurred!', 'assertive');
```

### ARIA Attributes Builder

```jsx
import { buildAriaAttributes } from './utils/accessibilityUtils';

const attrs = buildAriaAttributes({
  label: 'Close dialog',
  expanded: isOpen,
  controls: 'menu-id',
  haspopup: 'menu',
});

<button {...attrs}>Menu</button>
```

### Accessibility Helpers

```jsx
import {
  generateId,
  prefersReducedMotion,
  isFocusable,
  moveFocusTo,
} from './utils/accessibilityUtils';

// Generate unique IDs
const id = generateId('tooltip');

// Check if user prefers reduced motion
if (prefersReducedMotion()) {
  // Disable animations
}

// Check if element is focusable
if (isFocusable(element)) {
  moveFocusTo(element, { delay: 100 });
}
```

---

## 5. Error Logging

### Using the Error Logger

```jsx
import {
  logError,
  logWarning,
  logInfo,
  logNetworkError,
  useErrorLogger,
} from './utils/errorLogger';

// Log errors
logError('Something went wrong', { userId: '123' });
logWarning('This might be a problem');
logInfo('User logged in');

// Log network errors
try {
  await fetchData();
} catch (error) {
  logNetworkError(error, {
    endpoint: '/api/data',
    method: 'GET',
  });
}

// Use in components
const MyComponent = () => {
  const { errors, getStats, clearErrors } = useErrorLogger();

  const stats = getStats();
  console.log('Total errors:', stats.total);
  console.log('By level:', stats.byLevel);
  console.log('By category:', stats.byCategory);

  return (
    <div>
      <p>Errors: {stats.total}</p>
      <button onClick={clearErrors}>Clear</button>
    </div>
  );
};
```

### Error Levels
- `DEBUG` - Debug information
- `INFO` - Informational messages
- `WARNING` - Warning messages
- `ERROR` - Error messages
- `CRITICAL` - Critical errors

### Error Categories
- `NETWORK` - Network errors
- `VALIDATION` - Validation errors
- `AUTH` - Authentication errors
- `PERMISSION` - Permission errors
- `NOT_FOUND` - Not found errors
- `SERVER` - Server errors
- `CLIENT` - Client errors
- `UNKNOWN` - Unknown errors

### Configure Error Logger

```jsx
import { ErrorLogger } from './utils/errorLogger';

const customLogger = new ErrorLogger({
  enableConsole: true,
  enableStorage: true,
  maxStorageSize: 100,
  enableRemoteLogging: true,
  remoteEndpoint: 'https://api.example.com/logs',
});
```

---

## 6. Testing Page

Visit `/accessibility-test` to see all features in action:

- ✅ Error boundary test
- ✅ Loading states demonstration
- ✅ Form validation examples
- ✅ Accessibility compliance tests
- ✅ Error logging statistics

---

## Best Practices

### Error Handling
1. Always wrap main app with ErrorBoundary
2. Use section boundaries for isolated features
3. Log errors to external service in production
4. Show user-friendly error messages
5. Provide recovery actions (retry, go home)

### Loading States
1. Use appropriate loader for context
2. Show skeleton loaders for content placeholders
3. Use progress bars for determinate operations
4. Keep loading messages concise
5. Don't nest multiple loaders

### Form Validation
1. Validate on blur for better UX
2. Show errors only after field is touched
3. Provide clear, actionable error messages
4. Disable submit during validation
5. Use aria-invalid and aria-describedby

### Accessibility
1. Always use semantic HTML
2. Provide ARIA labels for custom components
3. Ensure keyboard navigation works
4. Test with screen readers
5. Maintain focus management in modals
6. Use aria-live regions for dynamic content

### Error Logging
1. Log all unexpected errors
2. Include context (user ID, action, etc.)
3. Don't log sensitive data
4. Monitor error trends
5. Set up alerts for critical errors

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Impact

- Error boundaries: Minimal (~1KB)
- Loading states: ~3KB (gzipped)
- Form validation: ~4KB (gzipped)
- Accessibility utils: ~5KB (gzipped)
- Error logging: ~6KB (gzipped)

**Total:** ~19KB gzipped

---

## Testing Checklist

- [ ] Error boundary catches errors correctly
- [ ] Loading states animate smoothly
- [ ] Form validation works on all fields
- [ ] Keyboard navigation functional
- [ ] Screen reader announces updates
- [ ] Focus trap works in modals
- [ ] Error logger stores errors
- [ ] ARIA attributes correct
- [ ] No console errors
- [ ] Works on mobile devices

---

## Troubleshooting

### Error boundary not catching errors
- Ensure component is wrapped with ErrorBoundary
- Check if error occurs in event handler (use try-catch)
- Verify React version >= 16.0

### Form validation not working
- Check validationSchema format
- Verify validators are functions
- Ensure handleBlur is called

### Focus trap not working
- Check if modal has focusable elements
- Verify ref is attached correctly
- Test with Tab key

### ARIA announcer silent
- Check if aria-live region exists
- Verify screen reader is enabled
- Test announcement timing

---

## Next Steps

1. Add unit tests with Jest/Vitest
2. Add E2E tests with Playwright
3. Set up error monitoring (Sentry)
4. Add performance monitoring
5. Implement A/B testing for UX

---

Last Updated: December 11, 2025
