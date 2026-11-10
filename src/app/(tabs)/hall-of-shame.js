
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Screen } from '@/components/screen';
import { colors } from '@/constants/palette';
import { createId, loadRatings, saveRatings } from '@/lib/records';

export default function HallOfShameScreen() {
    const [ratings, setRatings] = useState([]);
    const [person, setPerson] = useState('');
    const [reason, setReason] = useState('');
    const [stars, setStars] = useState(3);
    const [loaded, setLoaded] = useState(false);

    async function refreshRatings() {
        const saved = await loadRatings();
        setRatings(saved);
        setLoaded(true);
    }

    if (!loaded) {
        refreshRatings().catch(() => setLoaded(true));
    }

    async function addRating() {
        const cleanName = person.trim();

        if (!cleanName) {
            Alert.alert('Name required', 'Please enter a person\'s name.');
        return;
        }

        const existing = ratings.find(
            (r) => r.person.toLowerCase() === cleanName.toLowerCase()
        );

        const updated = existing
            ? ratings.map((r) =>
                r.id === existing.id
                    ? { ...r, stars, reason: reason.trim() }
                    : r
            )
            : [
                ...ratings,
                {
                    id: createId(),
                    person: cleanName,
                    stars,
                    reason: reason.trim(),
                },
            ];

        updated.sort((a, b) => a.stars - b.stars);

        await saveRatings(updated);
        setRatings(updated);
        setPerson('');
        setReason('');
        setStars(3);
        Alert.alert('Saved!', 'Rating added successfully.');
    }

    function editRating(rating) {
        setPerson(rating.person);
        setReason(rating.reason || '');
        setStars(rating.stars);
    }

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Hall of Shame 🏆</Text>
                <Text style={styles.subtitle}>
                    Keep track of the people who are slow to return your stuff.
                </Text>

                <View style={styles.form}>
                    <Text style={styles.heading}>Rate a borrower</Text>

                    <Text style={styles.label}>Person's name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter name"
                        placeholderTextColor={colors.muted}
                        value={person}
                        onChangeText={setPerson}
                    />

                    <Text style={styles.label}>Your rating</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((number) => (
                            <Pressable key={number} onPress={() => setStars(number)}>
                                <Text style={styles.star}>
                                    {number <= stars ? '★' : '☆'}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.label}>Reason (optional)</Text>
                    <TextInput
                        style={[styles.input, styles.reason]}
                        placeholder="e.g. Keeps forgetting to return things"
                        placeholderTextColor={colors.muted}
                        value={reason}
                        onChangeText={setReason}
                        multiline
                    />

                    <Pressable style={styles.button} onPress={addRating}>
                        <Text style={styles.buttonText}>Save Rating</Text>
                    </Pressable>
                </View>

                <Text style={styles.heading}>Lowest rated first</Text>

                {ratings.length === 0 ? (
                    <Text style={styles.empty}>
                        No ratings yet. Add your first borrower above!
                    </Text>
                ) : (
                    ratings.map((rating, index) => (
                        <Pressable
                            key={rating.id}
                            style={styles.card}
                            onPress={() => editRating(rating)}
                        >
                            <View style={styles.cardTop}>
                                <Text style={styles.rank}>#{index + 1}</Text>
                                <Text style={styles.name}>{rating.person}</Text>
                                <Text style={styles.rating}>
                                    {'★'.repeat(rating.stars)}{'☆'.repeat(5 - rating.stars)}
                                </Text>
                            </View>
                            {rating.reason ? (
                                <Text style={styles.reasonText}>{rating.reason}</Text>
                            ) : null}
                            <Text style={styles.edit}>Tap to edit rating</Text>
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: colors.muted,
        marginBottom: 22,
    },
    form: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 18,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: colors.border,
    },
    heading: {
        fontSize: 19,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 14,
    },
    label: {
        color: colors.purpleInk,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 7,
    },
    input: {
        backgroundColor: colors.input,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 13,
        color: colors.text,
        fontSize: 15,
    },
    stars: {
        flexDirection: 'row',
        gap: 10,
    },
    star: {
        fontSize: 34,
        color: '#E6A83D',
    },
    reason: {
        minHeight: 75,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: colors.purple,
        borderRadius: 14,
        padding: 15,
        alignItems: 'center',
        marginTop: 18,
    },
    buttonText: {
        color: colors.purpleInk,
        fontWeight: '800',
        fontSize: 16,
    },
    empty: {
        color: colors.muted,
        textAlign: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 15,
        marginBottom: 12,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    rank: {
        color: colors.muted,
        fontWeight: '700',
    },
    name: {
        color: colors.text,
        fontSize: 17,
        fontWeight: '800',
        flex: 1,
    },
    rating: {
        color: '#E6A83D',
        fontSize: 17,
    },
    reasonText: {
        color: colors.muted,
        marginTop: 9,
    },
    edit: {
        color: colors.purpleInk,
        fontSize: 12,
        marginTop: 9,
    },
});
