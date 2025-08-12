import './css/App.css'
import { Connection } from './features/valkeyconnection/valkeyConnection'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setConnecting } from './features/wsconnection/wsConnectionSlice';
import { selectConnected, selectStatus } from './features/valkeyconnection/valkeyConnectionSlice';
import { SendCommand } from './features/valkeycommand/valkeyCommand';



function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setConnecting(true))
  }, [dispatch])

  const valkeyConnected = useSelector(selectConnected)
  const valkeyconnectionStatus = useSelector(selectStatus)

  return (
    <>
      <header>Connection Status: {valkeyconnectionStatus}</header>
      <h1>Valkey Boilerplate</h1>
      {valkeyConnected ?
        <SendCommand />
        :
        <Connection />
      }
    </>
  )
}

export default App
