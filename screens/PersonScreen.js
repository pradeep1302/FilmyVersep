import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { styles } from "../theme/themeStyle";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchPersonDetails, fetchPersonMovies, image342, personFallback } from "../api/moviedb";

var { width, height } = Dimensions.get("window");

const PersonScreen = () => {
  const {params: item} = useRoute()
    const [isFavourite, toggleFavourite] = useState(false);
  const [personMovies, setPersonMovies] = useState([])
  const [person, setPerson] = useState({})
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()
  useEffect(() => {
    setLoading(true);
    getPerson(item.id);
    getPersonMovies(item.id);
  }, [item])
  
  const getPerson = async (id) => {
    const data = await fetchPersonDetails(id);
    if(data) setPerson(data)
    setLoading(false)
  }
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    if(data&&data.cast) setPersonMovies(data.cast)
  }
  return loading ? (
    <Loading />
  ) : (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <SafeAreaView className="z-20 w-full flex-row justify-between items-center px-4 mt-3 mb-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.background}
          className="rounded-xl p-1"
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
          <HeartIcon size="35" color={isFavourite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      <View>
        <View className="flex-row justify-center pb-5">
          <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
            <Image
              source={{ uri: image342(person?.profile_path) || personFallback }}
              style={{ height: height * 0.43, width: width * 0.74 }}
            />
          </View>
        </View>
        <View class="mt-6">
          <Text className="text-3xl text-white font-bold text-center">
            {person?.name}
          </Text>
          <Text className="text-base text-neutral-500 text-center">
            {person?.place_of_birth}
          </Text>
        </View>
        <View className="mx-3 py-4 px-2 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-white font-semibold">Gender</Text>
            <Text className="text-neutral-300 text-sm">
              {person?.gender == 1 ? "Female" : "Male"}
            </Text>
          </View>
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-white font-semibold">Birth</Text>
            <Text className="text-neutral-300 text-sm">{person?.birthday}</Text>
          </View>
          <View className="border-r-2 border-r-neutral-400 px-2 items-center">
            <Text className="text-white font-semibold">Known for</Text>
            <Text className="text-neutral-300 text-sm">
              {person?.known_for_department}
            </Text>
          </View>
          <View className=" px-2 items-center">
            <Text className="text-white font-semibold">Popularity</Text>
            <Text className="text-neutral-300 text-sm">
              {person?.popularity?.toFixed(2)} %
            </Text>
          </View>
        </View>
        <View className="my-6 mx-4 space-y-2">
          <Text className="text-white text-lg">Biography</Text>
          <Text className="text-neutral-400 tracking-wide">
            {person?.biography||'N/A'}
          </Text>
        </View>
      </View>
      <MovieList title="Movies" hideSeeAll={true} data={personMovies} />
    </ScrollView>
  );
};

export default PersonScreen;
