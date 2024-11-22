// Add this code block for the current level display and retry logic
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import { Audio } from "expo-av";

export default function TabOneScreen() {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [imgData, setImgData] = useState<
    { id: number; src: string; name: string }[]
  >([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1); // Keep track of level
  const [clickedIds, setClickedIds] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("Click any image to start playing!");
  const confettiRef = useRef<any>(null);

  const winSound = useRef<Audio.Sound | null>(null);
  const loseSound = useRef<Audio.Sound | null>(null);
  const clickSound = useRef<Audio.Sound | null>(null);
  const backgroundSound = useRef<Audio.Sound | null>(null);

  const fetchPokemon = async (level: number) => {
    setIsLoading(true);
    try {
      const limit = 6 + (level - 1) * 3; // Increase limit by 3 per level
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?offset=20&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch Pokémon data");

      const data = await res.json();
      setImgData(
        data.results.map((item: { name: string }, index: number) => ({
          id: index + 1,
          src: `https://img.pokemondb.net/artwork/${item.name}.jpg`,
          name: item.name,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(level);

    const loadSounds = async () => {
      winSound.current = new Audio.Sound();
      loseSound.current = new Audio.Sound();
      clickSound.current = new Audio.Sound();
      backgroundSound.current = new Audio.Sound();

      await winSound.current.loadAsync(
        require("@/assets/sounds/mixkit-small-win-2020.wav")
      );
      await loseSound.current.loadAsync(
        require("@/assets/sounds/mixkit-losing-bleeps-2026.wav")
      );
      await clickSound.current.loadAsync(
        require("@/assets/sounds/mixkit-fast-small-sweep-transition-166.wav")
      );
      await backgroundSound.current.loadAsync(
        require("@/assets/sounds/mixkit-medieval-show-fanfare-announcement-226.wav")
      );

      await backgroundSound.current.playAsync();
      backgroundSound.current.setIsLoopingAsync(true);
    };

    loadSounds();

    return () => {
      winSound.current?.unloadAsync();
      loseSound.current?.unloadAsync();
      clickSound.current?.unloadAsync();
      backgroundSound.current?.unloadAsync();
    };
  }, [level]);

  const playSound = async (
    soundRef: React.MutableRefObject<Audio.Sound | null>
  ) => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopBackgroundSound = async () => {
    if (backgroundSound.current) {
      await backgroundSound.current.pauseAsync();
    }
  };

  const restartBackgroundSound = async (delay = 0) => {
    setTimeout(async () => {
      if (backgroundSound.current) {
        await backgroundSound.current.playAsync();
      }
    }, delay);
  };

  const handleClick = async (id: number) => {
    stopBackgroundSound(); // Stop background sound on every click

    if (clickedIds.has(id)) {
      // Game over
      setMessage(
        `GAME OVER! Your score is ${score}. Try level ${level} again.`
      );
      await playSound(loseSound);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      resetGame(false); // Retry the current level
      restartBackgroundSound(2000); // Delay background sound for 2 seconds
    } else {
      const newScore = score + 1;

      if (newScore >= imgData.length) {
        // Win condition
        setMessage(
          `YOU WON! Your score is ${newScore}. Leveling up to ${level + 1}!`
        );
        confettiRef.current?.start();
        await playSound(winSound);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setLevel((prev) => prev + 1);
        resetGame(false); // Reset without resetting level
        restartBackgroundSound(2000); // Delay background sound for 2 seconds
      } else {
        // Regular click
        setScore(newScore);
        setMessage(`Keep going! Score: ${newScore}`);
        shuffleData(imgData);
        await playSound(clickSound);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      setClickedIds((prev) => new Set(prev).add(id));
    }
  };

  const resetGame = (resetLevel = true) => {
    setScore(0);
    setClickedIds(new Set());
    if (resetLevel) setLevel(1); // Reset level only if specified
    restartBackgroundSound();
  };

  const shuffleData = (array: { id: number; src: string; name: string }[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setImgData(shuffled);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center w-screen">
        <Text className="font-bold text-center text-2xl">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 pt-10">
      <StatusBar />
      <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
      >
        <Image
          className="w-12 h-12 rounded-full"
          source={{ uri: "https://img.pokemondb.net/artwork/pikachu.jpg" }}
        />
        <Text className="text-white text-2xl font-bold ml-3">Pokermoon</Text>
      </LinearGradient>

      <Text className="text-center text-md font-bold mt-2">
        Level: {level} {/* Display current level */}
      </Text>
      <Text className="text-center text-md font-bold mt-2">
        Don't click the same image twice
      </Text>
      <Text
        style={{
          color: message.includes("GAME OVER") ? "red" : "green",
          textAlign: "center",
          fontSize: 18,
          marginVertical: 10,
        }}
      >
        {message}
      </Text>

      <ScrollView
        contentContainerStyle={{
          width: "100%",
          paddingHorizontal: 2,
          justifyContent: "space-between",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {imgData?.map((item) => (
          <TouchableOpacity
            onPress={async () => {
              stopBackgroundSound(); // Stop background sound on first click
              await handleClick(item.id);
            }}
            className="w-[30%] items-center my-2 rounded-lg shadow-2xl p-2 bg-white"
            key={item.id}
          >
            <Image
              className="flex-1 w-24 h-24 rounded-full object-cover object-top"
              source={{
                uri: item.src,
              }}
            />
            <LinearGradient
              colors={["#6a11cb", "#2575fc"]}
              start={[0, 0]}
              end={[1, 1]}
              style={{ borderRadius: 5, width: "100%" }}
            >
              <Text className="text-gray-100 text-center mt-1 w-full rounded-lg p-1">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
  