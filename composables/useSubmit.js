// Takes a fn to do async work and returns an object
// { submitFn(), state, error }
// where `submitFn` calls the fn on created, `submissionState` is one of
// 'ready', 'submitting', 'submitted', or 'error'
// and `error` is a returned error from the fn
// This will ensure that only one copy of `submitFn` can be inflight
// at one time. `submissionState` and `error` are refs
// Also takes an optional submittedDurationMs

// This is intended to be used with SubmitButton to easily update
// the button states

export const useSubmit = (fn, submittedDurationMs = 3000) => {
  const submissionState = ref('ready')
  const error = ref(null)
  const submitFn = async () => {
    if (submissionState.value === 'submitting') return;

    error.value = null;
    submissionState.value = 'submitting'
    try {
      await fn()
    } catch (ex) {
      submissionState.value = 'error'
      error.value = ex
      setTimeout(() => submissionState.value = 'ready', submittedDurationMs)
      return
    }
    submissionState.value = 'submitted'
    setTimeout(() => submissionState.value = 'ready', submittedDurationMs)
  }
  
  return { submissionState, error, submitFn }
}
