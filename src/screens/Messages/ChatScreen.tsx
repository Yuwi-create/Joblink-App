import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { fetchMessages, sendMessage } from '@/api/messages';
import { Message } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/api/client';

const MAX_MESSAGE_LENGTH = 2000;

export default function ChatScreen({ route, navigation }: any) {
  const { conversationId, userName } = route.params;
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages(conversationId)
      .then(setMessages)
      .catch((err) => Alert.alert('Error', getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [conversationId]);

  const handleSend = async () => {
    const body = text.trim();
    if (!body || body.length > MAX_MESSAGE_LENGTH) return;
    setSending(true);
    setText('');
    try {
      const msg = await sendMessage(conversationId, body);
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (err) {
      Alert.alert('Could not send', getErrorMessage(err));
      setText(body); // restore so the user doesn't lose their message
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bgLight }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.avatar}><Text style={styles.avatarText}>{userName?.[0] ?? '?'}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>{userName}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <TouchableOpacity><Ionicons name="ellipsis-vertical" size={20} color="#fff" /></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={{ padding: spacing.lg }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isMine = item.senderId === currentUserId;
            return (
              <View style={[styles.bubbleRow, isMine && { justifyContent: 'flex-end' }]}>
                <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                  {/* Render as plain text only — never as HTML/markdown from
                      another user, which would allow script/markup injection. */}
                  <Text style={isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>{item.body}</Text>
                  <Text style={styles.bubbleTime}>{item.createdAt}</Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity><Ionicons name="camera-outline" size={22} color={colors.textMuted} /></TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <TouchableOpacity onPress={handleSend} disabled={sending || !text.trim()} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary, paddingTop: 50, paddingBottom: spacing.md, paddingHorizontal: spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  circleBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  headerName: { color: '#fff', fontWeight: '700', fontSize: 15 },
  headerStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bubble: { maxWidth: '78%', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 10 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  bubbleTextMine: { color: '#fff', fontSize: 14 },
  bubbleTextTheirs: { color: colors.textDark, fontSize: 14 },
  bubbleTime: { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 4, alignSelf: 'flex-end' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
  },
  input: {
    flex: 1, backgroundColor: colors.bgLight, borderRadius: radius.pill,
    paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: 14, maxHeight: 100,
  },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
