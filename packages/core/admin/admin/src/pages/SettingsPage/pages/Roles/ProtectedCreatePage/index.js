import React, { useMemo } from 'react';
import { useRBAC, LoadingIndicatorPage } from '@strapi/helper-plugin';
import { Redirect } from 'react-router-dom';
import adminPermissions from '../../../../../permissions';
import CreatePage from "../CreatePage";

const ProtectedCreatePage = () => {
  const permissions = useMemo(() => {
    return {
      read: adminPermissions.settings.roles.read,
      update: adminPermissions.settings.roles.update,
    };
  }, []);

  const {
    isLoading,
    allowedActions: { canRead, canUpdate },
  } = useRBAC(permissions);

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  if (!canRead && !canUpdate) {
    return <Redirect to="/" />;
  }

  return <CreatePage />;
};

export default ProtectedCreatePage;
