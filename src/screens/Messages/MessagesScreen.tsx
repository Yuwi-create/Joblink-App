import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { fetchConversations } from '@/api/messages';
import { Conversation } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function MessagesScreen({ navigation }: any) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const filtered = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgLight }}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Messages</Text>
          {unreadTotal > 0 && <Text style={styles.unreadPill}>{unreadTotal} unread</Text>}
        </View>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search conversations..." value={search} onChangeText={setSearch} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : error ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textMuted }}>{error}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(c) => String(c.id)}
          contentContainerStyle={{ padding: spacing.lg }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>No conversations yet.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('Chat', { conversationId: item.id, userId: item.participant.id, userName: item.participant.name })}
            >
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.participant.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
                </View>
                {item.participant.online && <View style={styles.onlineDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.name}>{item.participant.name}</Text>
                  <Text style={styles.time}>{item.lastMessageAt}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.unreadDot}><Text style={styles.unreadDotText}>{item.unreadCount}</Text></View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingTop: 55, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  unreadPill: { color: '#fff', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatarWrap: { position: 'relative' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, backgroundColor: colors.success, borderWidth: 2, borderColor: '#fff' },
  name: { fontWeight: '700', color: colors.textDark, fontSize: 14 },
  time: { fontSize: 11, color: colors.textMuted },
  lastMessage: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  unreadDot: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadDotText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
