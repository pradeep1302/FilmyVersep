import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { styles, theme } from "../theme/themeStyle";
import { HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500, posterFallback } from "../api/moviedb";

var { width, height } = Dimensions.get("window");

const MovieScreen = () => {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const navigation = useNavigation();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id)
    getSimilar(item.id)
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    if (data) setMovie(data);
    setLoading(false);
  };
  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data&&data.cast) setCast(data.cast);
  };
  const getSimilar = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data&&data.results) setSimilarMovies(data.results);
  };

  return loading ? (
    <Loading />
  ) : (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      <View className="w-full">
        <SafeAreaView className="absolute z-20 w-full flex-row justify-between items-center px-4 mt-3">
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
          <Image
            source={{ uri: image500(movie?.poster_path) || posterFallback }}
            style={{ width, height: height * 0.55 }}
          />
          <LinearGradient
            colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
            style={{ width, height: height * 0.4 }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="absolute bottom-0"
          />
        </View>
      </View>

      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movie?.title}
        </Text>
        {movie?.id ? (
          <Text className="text-neutral-400 text-center text-base font-swmibold ">
            {movie?.status} • {movie?.release_date?.split("-")[0]} •{" "}
            {movie?.runtime} min
          </Text>
        ) : null}

        <View className="flex-row justify-center mx-4 space-x-2">
            {movie?.genres?.map((genre, index) => {
              let dot = index + 1 != movie.genres.length;
              return(

            <Text className="text-neutral-400 font-semibold text-base text-center" key={index}>
              {genre?.name} {dot?"•":null}
            </Text>
              )
          })}
        </View>

        <Text className="text-neutral-400 mx-4 tracking-wide">
            {
              movie?.overview
          }
        </Text>
      </View>

      <Cast navigation={navigation} cast={cast} />

      <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies}/>
    </ScrollView>
  );
};

export default MovieScreen;
