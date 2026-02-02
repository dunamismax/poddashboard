import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, List, Surface, Text } from 'react-native-paper';

const pods = [
  {
    name: 'Northside Magic Pod',
    members: 7,
    next: 'Tonight · 7:00 PM',
    status: '3 confirmed · 2 on the way',
  },
  {
    name: 'Midweek Board Crew',
    members: 5,
    next: 'Wed · 6:30 PM',
    status: 'Planning in progress',
  },
];

const upcoming = [
  { title: 'D&D Session 12', when: 'Sat · 2:00 PM', place: 'Jules’ place' },
  { title: 'Bouldering swap', when: 'Sun · 10:00 AM', place: 'Summit Gym' },
];

export default function ExploreScreen() {
  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.Content title="Pods" subtitle="Your trusted circles" />
        <Appbar.Action icon="magnify" onPress={() => undefined} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Card mode="outlined" style={styles.card}>
          <Card.Title title="Create a new pod" subtitle="Invite your regular crew in minutes." />
          <Card.Content>
            <Text variant="bodyMedium">
              Gatherer keeps coordination scoped to each meet-up. No feeds, no noise.
            </Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" icon="plus" onPress={() => undefined}>
              New pod
            </Button>
            <Button mode="outlined" icon="qrcode-scan" onPress={() => undefined}>
              Join with code
            </Button>
          </Card.Actions>
        </Card>

        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Your pods</Text>
          {pods.map((pod) => (
            <List.Item
              key={pod.name}
              title={pod.name}
              description={`${pod.members} members · ${pod.status}`}
              right={() => (
                <Text variant="labelSmall" style={styles.listMeta}>
                  {pod.next}
                </Text>
              )}
              left={(props) => <List.Icon {...props} icon="account-group" />}
            />
          ))}
        </Surface>

        <Surface elevation={1} style={styles.surface}>
          <Text variant="titleMedium">Upcoming across pods</Text>
          {upcoming.map((event) => (
            <List.Item
              key={event.title}
              title={event.title}
              description={`${event.when} · ${event.place}`}
              left={(props) => <List.Icon {...props} icon="calendar-star" />}
            />
          ))}
          <Button mode="text" onPress={() => undefined}>
            See all events
          </Button>
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
  listMeta: {
    alignSelf: 'center',
    opacity: 0.7,
  },
});
