import { useState } from 'react'

const useField = (type) => {
    const [value, setValue] = useState('')
  
    const onChange = (event) => {
      setValue(event.target.value)
    }
  
    const reset = () => {
      setValue('')
    }
    return {
      type,
      value,
      onChange,
      reset,
      props: { type, value, onChange }
    }
  }
  

  export default useField