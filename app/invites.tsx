import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';

import { useAcceptInvite, usePendingInvites } from '@/features/invites/invites-queries';
import { useSupabaseSession } from '@/hooks/use-supabase-session';

export default function InvitesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, isLoading: authLoading } = useSupabaseSession();
  const invitesQuery = usePendingInvites(user?.id, user?.email ?? null);
  const acceptInvite = useAcceptInvite();

  const isLoading = authLoading || invitesQuery.isLoading;

  const handleAccept = async (inviteId: string, podId: string) => {
    if (!user) return;
    try {
      await acceptInvite.mutateAsync({ inviteId, podId, userId: user.id });
      router.push(`/pod/${podId}`);
    } catch {
      // Errors surface in UI state via status text below.
    }
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Invites" subtitle="Pending pod invitations" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Your pending invites</Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : !user ? (
            <Text variant="bodyMedium">Sign in to view your invites.</Text>
          ) : invitesQuery.data && invitesQuery.data.length > 0 ? (
            invitesQuery.data.map((invite) => (
              <Surface key={invite.id} elevation={0} style={styles.inviteCard}>
                <Text variant="bodyLarge">{invite.pod?.name ?? 'Pod invite'}</Text>
                <Text variant="bodySmall" style={styles.caption}>
                  {invite.invited_email ?? 'Invited'}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => handleAccept(invite.id, invite.pod_id)}
                  disabled={acceptInvite.isPending}>
                  Accept invite
                </Button>
              </Surface>
            ))
          ) : (
            <Text variant="bodyMedium">No pending invites.</Text>
          )}
          {acceptInvite.isError ? (
            <Text variant="bodySmall" style={{ color: theme.colors.error }}>
              Unable to accept invite. Please try again.
            </Text>
          ) : null}
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  surface: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  inviteCard: {
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  caption: {
    opacity: 0.7,
  },
});
