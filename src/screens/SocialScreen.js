import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, ActivityIndicator, Alert, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { socialService } from '../services/socialService';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function SocialScreen() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    const result = await socialService.getFeed();
    if (!result.error) {
      setPosts(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post cannot be empty.');
      return;
    }

    setModalVisible(false);
    setLoading(true);
    
    const result = await socialService.createPost(user.uid, user.displayName || 'Athlete', postContent);
    if (!result.error) {
      setPostContent('');
      fetchFeed();
    } else {
      Alert.alert('Error', 'Failed to create post');
      setLoading(false);
    }
  };

  const handleLike = async (postId, currentLikes) => {
    const isLiked = currentLikes.includes(user.uid);
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: isLiked ? p.likes.filter(id => id !== user.uid) : [...p.likes, user.uid],
          likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1
        };
      }
      return p;
    }));
    await socialService.toggleLike(postId, user.uid, isLiked);
  };

  const renderPost = ({ item }) => {
    const isLiked = item.likes?.includes(user.uid);
    const timeString = new Date(item.createdAt).toLocaleDateString();

    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={20} color={COLORS.text} />
          </View>
          <View style={styles.postHeaderText}>
            <Text style={styles.authorName}>{item.userName}</Text>
            <Text style={styles.postTime}>{timeString}</Text>
          </View>
        </View>
        
        <Text style={styles.postContent}>{item.content}</Text>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleLike(item.id, item.likes || [])}
          >
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? COLORS.secondary : COLORS.textSecondary} />
            <Text style={[styles.actionText, isLiked && { color: COLORS.secondary }]}>
              {item.likesCount || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Feed</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="pencil" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchFeed}
        />
      )}

      {/* Create Post Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.form}>
            <TextInput
              style={styles.textArea}
              value={postContent}
              onChangeText={setPostContent}
              placeholder="Share your fitness progress or thoughts..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleCreatePost}>
              <Text style={styles.saveButtonText}>Post to Community</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  postCard: { backgroundColor: COLORS.surface, borderRadius: SPACING.md, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  authorName: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: 'bold' },
  postTime: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  postContent: { ...TYPOGRAPHY.body1, color: COLORS.text, marginBottom: SPACING.md, lineHeight: 22 },
  postActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: SPACING.lg },
  actionText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginLeft: 6 },
  
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { ...TYPOGRAPHY.h2, color: COLORS.text },
  form: { padding: SPACING.lg },
  textArea: { backgroundColor: COLORS.surface, color: COLORS.text, padding: SPACING.md, borderRadius: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg, fontSize: 16 },
  saveButton: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: SPACING.sm, alignItems: 'center' },
  saveButtonText: { ...TYPOGRAPHY.h3, color: COLORS.text },
});
