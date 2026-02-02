import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  List,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';

const upcomingEvent = {
  title: 'Tuesday Night Commander',
  pod: 'Northside Magic Pod',
  time: 'Tonight · 7:00–10:30 PM',
  location: 'Griffon Games',
  address: '2433 Ashland Ave',
};

const arrivalBoard = [
  { name: 'Steph', status: 'Arrived', eta: 'Here' },
  { name: 'Ravi', status: 'On the way', eta: '8 min' },
  { name: 'Jules', status: 'Running late', eta: '18 min' },
  { name: 'Maya', status: 'Not sure', eta: '—' },
];

const checklist = [
  { label: 'Commander decks', detail: '3 confirmed' },
  { label: 'Snacks', detail: 'Maya bringing' },
  { label: 'Spare sleeves', detail: 'Need 1 pack' },
];

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.Content title="Gatherer" subtitle="Your next meet-up" />
        <Appbar.Action icon="bell-outline" onPress={() => undefined} />
        <Appbar.Action icon="account-circle" onPress={() => undefined} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge">Next gather</Text>
        <Card mode="outlined" style={styles.card}>
          <Card.Title
            title={upcomingEvent.title}
            subtitle={upcomingEvent.pod}
            left={(props) => <Avatar.Text {...props} label="GN" />}
          />
          <Card.Content>
            <List.Item
              title={upcomingEvent.time}
              description={`${upcomingEvent.location} · ${upcomingEvent.address}`}
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
            />
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="outlined" onPress={() => undefined}>
              Can&apos;t make it
            </Button>
            <Button mode="contained" onPress={() => undefined}>
              I&apos;m in
            </Button>
          </Card.Actions>
        </Card>

        <Surface elevation={1} style={styles.surface}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Arrival board</Text>
            <Chip compact mode="outlined" textStyle={{ color: theme.colors.onSurfaceVariant }}>
              Live ETA
            </Chip>
          </View>
          <Divider style={styles.divider} />
          {arrivalBoard.map((member) => (
            <View key={member.name} style={styles.arrivalRow}>
              <Avatar.Text size={36} label={member.name.slice(0, 2).toUpperCase()} />
              <View style={styles.arrivalMeta}>
                <Text variant="bodyLarge">{member.name}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {member.status}
                </Text>
              </View>
              <Chip compact mode="outlined">
                {member.eta}
              </Chip>
            </View>
          ))}
        </Surface>

        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Checklist</Text>
          <Text variant="bodySmall" style={styles.sectionCaption}>
            Shared prep for tonight&apos;s session.
          </Text>
          {checklist.map((item) => (
            <List.Item
              key={item.label}
              title={item.label}
              description={item.detail}
              left={(props) => <List.Icon {...props} icon="checkbox-blank-circle-outline" />}
            />
          ))}
          <Button mode="text" onPress={() => undefined}>
            Update checklist
          </Button>
        </Surface>

        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Quick actions</Text>
          <View style={styles.actions}>
            <Button icon="plus" mode="contained" onPress={() => undefined}>
              Create event
            </Button>
            <Button icon="link-variant" mode="outlined" onPress={() => undefined}>
              Share invite
            </Button>
          </View>
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
  card: {
    borderRadius: 16,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  surface: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    marginTop: 4,
  },
  arrivalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arrivalMeta: {
    flex: 1,
  },
  sectionCaption: {
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
