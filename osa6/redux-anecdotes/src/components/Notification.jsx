import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (!notification) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: 'lightyellow',
    textAlign: 'center',
    
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
