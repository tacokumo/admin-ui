import { useState } from 'react';
import { Button, Card, Text, Badge, Stack, Group, Alert } from '@mantine/core';
import { IconRefresh, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { useAdminAPI } from '../hooks/useAdminAPI';

interface HealthStatus {
  liveness: {
    status: 'loading' | 'success' | 'error' | 'idle';
    message?: string;
    timestamp?: Date;
  };
  readiness: {
    status: 'loading' | 'success' | 'error' | 'idle';
    message?: string;
    timestamp?: Date;
  };
}

export const StatusPage = () => {
  const api = useAdminAPI();
  const [health, setHealth] = useState<HealthStatus>({
    liveness: { status: 'idle' },
    readiness: { status: 'idle' }
  });

  const checkLiveness = async () => {
    setHealth(prev => ({
      ...prev,
      liveness: { status: 'loading' }
    }));

    try {
      const response = await api.v1alpha1.health.liveness.get();
      setHealth(prev => ({
        ...prev,
        liveness: {
          status: 'success',
          message: `Service is alive (${response.status})`,
          timestamp: new Date()
        }
      }));
    } catch (error) {
      setHealth(prev => ({
        ...prev,
        liveness: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        }
      }));
    }
  };

  const checkReadiness = async () => {
    setHealth(prev => ({
      ...prev,
      readiness: { status: 'loading' }
    }));

    try {
      const response = await api.v1alpha1.health.readiness.get();
      setHealth(prev => ({
        ...prev,
        readiness: {
          status: 'success',
          message: `Service is ready (${response.status})`,
          timestamp: new Date()
        }
      }));
    } catch (error) {
      setHealth(prev => ({
        ...prev,
        readiness: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        }
      }));
    }
  };

  const checkAll = async () => {
    await Promise.all([checkLiveness(), checkReadiness()]);
  };

  const getStatusBadge = (status: HealthStatus['liveness']['status']) => {
    switch (status) {
      case 'loading':
        return <Badge color="yellow">Checking...</Badge>;
      case 'success':
        return <Badge color="green" leftSection={<IconCheck size={12} />}>Healthy</Badge>;
      case 'error':
        return <Badge color="red" leftSection={<IconX size={12} />}>Error</Badge>;
      case 'idle':
      default:
        return <Badge color="gray">Not checked</Badge>;
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text size="xl" fw={600}>Service Health Status</Text>
        <Button
          leftSection={<IconRefresh size={16} />}
          onClick={checkAll}
          loading={health.liveness.status === 'loading' || health.readiness.status === 'loading'}
        >
          Check All
        </Button>
      </Group>

      <Alert icon={<IconAlertCircle size={16} />} title="API Testing" color="blue">
        This page tests the useAdminAPI hook by making authenticated requests to the health endpoints.
        The hook automatically includes Auth0 Bearer tokens in the Authorization header.
      </Alert>

      <Group grow>
        {/* Liveness Check */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={500}>Liveness Check</Text>
              {getStatusBadge(health.liveness.status)}
            </Group>

            <Text size="sm" c="dimmed">
              Endpoint: /v1alpha1/health/liveness
            </Text>

            {health.liveness.message && (
              <Text size="sm" c={health.liveness.status === 'error' ? 'red' : 'green'}>
                {health.liveness.message}
              </Text>
            )}

            {health.liveness.timestamp && (
              <Text size="xs" c="dimmed">
                Last checked: {health.liveness.timestamp.toLocaleTimeString()}
              </Text>
            )}

            <Button
              variant="outline"
              onClick={checkLiveness}
              loading={health.liveness.status === 'loading'}
              fullWidth
            >
              Check Liveness
            </Button>
          </Stack>
        </Card>

        {/* Readiness Check */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={500}>Readiness Check</Text>
              {getStatusBadge(health.readiness.status)}
            </Group>

            <Text size="sm" c="dimmed">
              Endpoint: /v1alpha1/health/readiness
            </Text>

            {health.readiness.message && (
              <Text size="sm" c={health.readiness.status === 'error' ? 'red' : 'green'}>
                {health.readiness.message}
              </Text>
            )}

            {health.readiness.timestamp && (
              <Text size="xs" c="dimmed">
                Last checked: {health.readiness.timestamp.toLocaleTimeString()}
              </Text>
            )}

            <Button
              variant="outline"
              onClick={checkReadiness}
              loading={health.readiness.status === 'loading'}
              fullWidth
            >
              Check Readiness
            </Button>
          </Stack>
        </Card>
      </Group>
    </Stack>
  );
};

export default StatusPage;