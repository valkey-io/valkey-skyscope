import { selectStatus } from '@/state/valkey-features/connection/connectionSelectors.ts';
import { CONNECTED } from '@common/src/constants';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const RequireConnection = () => {
    const isConnected = useSelector(selectStatus) === CONNECTED;
    console.log('Connected:', isConnected);

    return isConnected ? <Outlet /> : <Navigate to="/connect" replace />;
};

export default RequireConnection;