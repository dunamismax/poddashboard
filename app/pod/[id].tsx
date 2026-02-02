import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Divider,
  HelperText,
  List,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { usePodMembers, usePodsByUser } from '@/features/pods/pods-queries';
import { useCreateInvite, usePodInvites } from '@/features/invites/invites-queries';
import { useProfilesByIds } from '@/features/profiles/profiles-queries';
import { useSupabaseSession } from '@/hooks/use-supabase-session';

function formatMemberName(
  userId: string,
  profile?: { display_name: string | null; first_name: string | null; last_name: string | null; email: string | null }
) {
  if (!profile) return `Member ${userId.slice(0, 4).toUpperCase()}`;
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  return profile.display_name || fullName || profile.email || `Member ${userId.slice(0, 4).toUpperCase()}`;
}

export default function PodDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const podId = typeof params.id === 'string' ? params.id : '';
  const { user, isLoading: authLoading } = useSupabaseSession();

  const podsQuery = usePodsByUser(user?.id);
  const pod = useMemo(() => (podsQuery.data ?? []).find((item) => item.id === podId), [podsQuery.data, podId]);
  const membersQuery = usePodMembers(podId);
  const memberIds = useMemo(
    () => (membersQuery.data ?? []).map((member) => member.user_id),
    [membersQuery.data]
  );
  const profilesQuery = useProfilesByIds(memberIds);
  const profileById = useMemo(
    () => new Map((profilesQuery.data ?? []).map((profile) => [profile.id, profile])),
    [profilesQuery.data]
  );
  const invitesQuery = usePodInvites(podId);
  const createInvite = useCreateInvite();

  const [inviteEmail, setInviteEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const isAdmin = pod?.role === 'owner' || pod?.role === 'admin';
  const inviteEmailError = inviteEmail.length > 0 && !inviteEmail.includes('@');

  const handleInvite = async () => {
    if (!user || !podId || inviteEmailError || inviteEmail.trim().length === 0) return;
    setStatus(null);
    try {
      await createInvite.mutateAsync({
        podId,
        invitedEmail: inviteEmail.trim().toLowerCase(),
        invitedBy: user.id,
      });
      setInviteEmail('');
      setStatus('Invite sent.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send invite.');
    }
  };

  const isLoading =
    authLoading || podsQuery.isLoading || membersQuery.isLoading || profilesQuery.isLoading;

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={pod?.name ?? 'Pod'} subtitle="Members and invites" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Pod details</Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : pod ? (
            <>
              <Text variant="bodyLarge">{pod.name}</Text>
              {pod.description ? <Text variant="bodyMedium">{pod.description}</Text> : null}
              <Text variant="bodySmall" style={styles.caption}>
                {pod.location_text ?? 'Location TBD'} · {pod.role}
              </Text>
              <Button mode="outlined" onPress={() => router.push('/create-event')}>
                Schedule event
              </Button>
            </>
          ) : (
            <Text variant="bodyMedium">You don&apos;t have access to this pod.</Text>
          )}
        </Surface>

        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Members</Text>
          {membersQuery.isLoading ? (
            <ActivityIndicator />
          ) : membersQuery.data && membersQuery.data.length > 0 ? (
            membersQuery.data.map((member) => {
              const profile = profileById.get(member.user_id);
              return (
              <List.Item
                key={member.user_id}
                title={formatMemberName(member.user_id, profile)}
                description={
                  profile
                    ? [profile.phone, profile.contact_email, profile.contact_handle]
                        .filter(Boolean)
                        .join(' · ')
                    : 'Profile not available yet'
                }
                left={(props) => <List.Icon {...props} icon="account-circle" />}
                right={() => <Text style={styles.roleLabel}>{member.role}</Text>}
              />
              );
            })
          ) : (
            <Text variant="bodyMedium">No members yet.</Text>
          )}
        </Surface>

        {isAdmin ? (
          <Surface elevation={1} style={styles.surface}>
            <Text variant="titleMedium">Invite someone</Text>
            <TextInput
              mode="outlined"
              label="Email address"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <HelperText type="error" visible={inviteEmailError}>
              Enter a valid email address.
            </HelperText>
            <Button
              mode="contained"
              onPress={handleInvite}
              disabled={inviteEmailError || createInvite.isPending}>
              Send invite
            </Button>
            {status ? (
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                {status}
              </Text>
            ) : null}
            <Divider style={styles.divider} />
            <Text variant="bodySmall" style={styles.caption}>
              Pending invites
            </Text>
            {invitesQuery.isLoading ? (
              <ActivityIndicator />
            ) : invitesQuery.data && invitesQuery.data.length > 0 ? (
              invitesQuery.data.map((invite) => (
                <List.Item
                  key={invite.id}
                  title={invite.invited_email ?? 'Invite'}
                  description={`Status: ${invite.status}`}
                  left={(props) => <List.Icon {...props} icon="email-outline" />}
                />
              ))
            ) : (
              <Text variant="bodyMedium">No pending invites.</Text>
            )}
          </Surface>
        ) : null}
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
  input: {
    backgroundColor: 'transparent',
  },
  caption: {
    opacity: 0.7,
  },
  divider: {
    marginTop: 8,
  },
  roleLabel: {
    alignSelf: 'center',
    opacity: 0.7,
  },
});
