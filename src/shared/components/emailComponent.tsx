import { useState } from "react";
import { Colors } from "../constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmailCardProps {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  priority: 'Urgent' | 'Normal' | 'Low';
  timestamp: string;
  isRead?: boolean;
  hasAttachment?: boolean;
  onPress?: (id: string) => void;
  onLongPress?: (id: string) => void;
}
const C = Colors.dark;
const S = Colors.spacing;
const R = Colors.radius;

export const EmailCard: React.FC<EmailCardProps> = ({
  id,
  sender,
  senderEmail,
  subject,
  preview,
  priority,
  timestamp,
  isRead = false,
  hasAttachment = false,
  onPress,
  onLongPress
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getPriorityColor = () => {
    switch(priority) {
      case 'Urgent': return '#FF4444';
      case 'Normal': return Colors.dark.primary;
      case 'Low': return '#4CAF50';
      default: return C.border;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(id)}
      onLongPress={() => onLongPress?.(id)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.emailCard,
        { 
          backgroundColor: isRead ? C.surface : C.surface + 'CC',
          opacity: isPressed ? 0.8 : 1,
          borderLeftWidth: 4,
          borderLeftColor: getPriorityColor()
        }
      ]}>
        {/* Avatar / Sender Initials */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: getPriorityColor() + '33' }]}>
            <Text style={styles.avatarText}>{getInitials(sender)}</Text>
          </View>
        </View>

        {/* Email Content */}
        <View style={styles.emailContent}>
          <View style={styles.headerRow}>
            <View style={styles.senderContainer}>
              <Text style={[styles.sender, !isRead && styles.unread]} numberOfLines={1}>
                {sender}
              </Text>
              {senderEmail && (
                <Text style={styles.senderEmail} numberOfLines={1}>
                  {senderEmail}
                </Text>
              )}
            </View>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>

          <Text style={[styles.subject, !isRead && styles.unread]} numberOfLines={1}>
            {subject}
          </Text>
          
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>

          {/* Footer with indicators */}
          <View style={styles.footer}>
            {priority === 'Urgent' && (
              <View style={[styles.priorityBadge, { backgroundColor: '#FF4444' }]}>
                <Text style={styles.badgeText}>Urgent</Text>
              </View>
            )}
            {hasAttachment && (
              <View style={styles.attachmentBadge}>
                <Text style={styles.badgeText}>📎</Text>
              </View>
            )}
            {!isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create( {

  emailCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  emailContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sender: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  senderEmail: {
    fontSize: 12,
    color: Colors.dark.text + '80',
  },
  timestamp: {
    fontSize: 11,
    color: Colors.dark.text + '80',
  },

    subject: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.primary,
  },
  
  preview: {
    fontSize: 13,
    color: Colors.dark.text + 'B3',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  attachmentBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  unread: {
    fontWeight: '700',
  },
})