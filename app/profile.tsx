import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Appbar,
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { useProfile, useUpsertProfile } from '@/features/profiles/profiles-queries';
import { useSupabaseSession } from '@/hooks/use-supabase-session';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, isLoading: authLoading } = useSupabaseSession();
  const profileQuery = useProfile(user?.id);
  const upsertProfile = useUpsertProfile();

  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!profileQuery.data) return;
    setDisplayName(profileQuery.data.display_name ?? '');
    setFirstName(profileQuery.data.first_name ?? '');
    setLastName(profileQuery.data.last_name ?? '');
    setPhone(profileQuery.data.phone ?? '');
    setContactEmail(profileQuery.data.contact_email ?? '');
    setContactHandle(profileQuery.data.contact_handle ?? '');
    setContactNotes(profileQuery.data.contact_notes ?? '');
  }, [profileQuery.data]);

  const firstNameError = firstName.trim().length === 0;
  const lastNameError = lastName.trim().length === 0;
  const emailError = contactEmail.length > 0 && !contactEmail.includes('@');

  const handleSave = async () => {
    if (!user || firstNameError || lastNameError || emailError) return;
    setStatus(null);
    try {
      await upsertProfile.mutateAsync({
        id: user.id,
        email: user.email ?? null,
        display_name: displayName.trim() ? displayName.trim() : null,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() ? phone.trim() : null,
        contact_email: contactEmail.trim() ? contactEmail.trim() : null,
        contact_handle: contactHandle.trim() ? contactHandle.trim() : null,
        contact_notes: contactNotes.trim() ? contactNotes.trim() : null,
      });
      setStatus('Profile saved.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save profile.');
    }
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Your profile" subtitle="Visible to your pod members" />
      </Appbar.Header>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Surface elevation={1} style={styles.surface}>
            <Text variant="titleMedium">Basics</Text>
            {authLoading || profileQuery.isLoading ? (
              <ActivityIndicator />
            ) : !user ? (
              <Text variant="bodyMedium">Sign in to edit your profile.</Text>
            ) : (
              <>
                <TextInput
                  mode="outlined"
                  label="Display name (optional)"
                  value={displayName}
                  onChangeText={setDisplayName}
                  style={styles.input}
                />
                <TextInput
                  mode="outlined"
                  label="First name"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  style={styles.input}
                />
                <HelperText type="error" visible={firstNameError}>
                  First name is required.
                </HelperText>
                <TextInput
                  mode="outlined"
                  label="Last name"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  style={styles.input}
                />
                <HelperText type="error" visible={lastNameError}>
                  Last name is required.
                </HelperText>
                <Text variant="bodySmall" style={styles.caption}>
                  Signed in as {user.email ?? 'Unknown email'}.
                </Text>
              </>
            )}
          </Surface>

          <Surface elevation={1} style={styles.surface}>
            <Text variant="titleMedium">Contact details</Text>
            {!user ? (
              <Text variant="bodyMedium">Sign in to add contact details.</Text>
            ) : (
              <>
                <TextInput
                  mode="outlined"
                  label="Phone (optional)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <TextInput
                  mode="outlined"
                  label="Contact email (optional)"
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                <HelperText type="error" visible={emailError}>
                  Enter a valid contact email address.
                </HelperText>
                <TextInput
                  mode="outlined"
                  label="Contact handle (optional)"
                  value={contactHandle}
                  onChangeText={setContactHandle}
                  style={styles.input}
                />
                <TextInput
                  mode="outlined"
                  label="Notes (optional)"
                  value={contactNotes}
                  onChangeText={setContactNotes}
                  multiline
                  style={styles.input}
                />
              </>
            )}
          </Surface>

          <Surface elevation={1} style={styles.surface}>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={
                !user ||
                authLoading ||
                profileQuery.isLoading ||
                upsertProfile.isPending ||
                firstNameError ||
                lastNameError ||
                emailError
              }>
              Save profile
            </Button>
            {status ? (
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                {status}
              </Text>
            ) : null}
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
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
});
