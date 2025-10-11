import { Loader, Stack, Text } from '@mantine/core';

export default function DefaultLoader() {
  return (
    <Stack align="center" gap="md">
      <Loader color="blue" size="xl" />
      <Text size="sm" c="dimmed">
        ロード中です...☕を飲んでゆったりしましょう
      </Text>
    </Stack>
  );
}