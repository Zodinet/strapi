import React, { useRef, useState } from 'react';
import {
  request,
  useNotification,
  useOverlayBlocker,
  SettingsPageTitle,
  Link,
} from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system/Button';
import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Stack } from '@strapi/design-system/Stack';
import { Formik } from 'formik';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import get from 'lodash/get';
import { useIntl } from 'react-intl';
import { RoleForm } from './components';
import schema from './utils/schema';
import { useHistory } from 'react-router-dom';

const CreatePage = () => {
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();
  const [isSubmitting, setIsSubmiting] = useState(false);
  const { lockApp, unlockApp } = useOverlayBlocker();
  const { push } = useHistory();
  const role = {
    name: '',
    description: ''
  }

  const handleCreateRoleSubmit = async data => {
    try {
      lockApp();
      setIsSubmiting(true);

      await request(`/admin/roles`, {
        method: 'POST',
        body: data,
      });

      toggleNotification({
        type: 'success',
        message: { id: 'notification.success.saved' },
      });

      push('/settings/roles')

      return true;
    } catch (err) {
      console.error(err.response);

      const errorMessage = get(err, 'response.payload.message', 'An error occured');
      const message = get(err, 'response.payload.data.permissions[0]', errorMessage);

      toggleNotification({
        type: 'warning',
        message,
      });
    } finally {
      setIsSubmiting(false);
      unlockApp();
    }
  };

  return (
    <Main>
      <SettingsPageTitle name="Roles" />
      <Formik
        enableReinitialize
        initialValues={{
          name: role.name,
          description: role.description,
        }}
        onSubmit={handleCreateRoleSubmit}
        validationSchema={schema}
        validateOnChange={false}
      >
        {({ handleSubmit, values, errors, handleChange, handleBlur }) => (
          <form onSubmit={handleSubmit}>
            <>
              <HeaderLayout
                primaryAction={
                  <Stack horizontal spacing={2}>
                    <Button
                      onClick={handleSubmit}
                      loading={isSubmitting}
                      size="L"
                    >
                      {formatMessage({
                        id: 'global.save',
                        defaultMessage: 'Save',
                      })}
                    </Button>
                  </Stack>
                }
                title={formatMessage({
                  id: 'Settings.roles.create.title',
                  defaultMessage: 'Create a role',
                })}
                subtitle={formatMessage({
                  id: 'Settings.roles.create.description',
                  defaultMessage: 'Define the rights given to the role',
                })}
                navigationAction={
                  <Link startIcon={<ArrowLeft />} to="/settings/roles">
                    {formatMessage({
                      id: 'global.back',
                      defaultMessage: 'Back',
                    })}
                  </Link>
                }
              />
              <ContentLayout>
                <Stack spacing={6}>
                  <RoleForm
                    errors={errors}
                    values={values}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    role={role}
                  />
                </Stack>
              </ContentLayout>
            </>
          </form>
        )}
      </Formik>
    </Main>
  );
};

export default CreatePage;
