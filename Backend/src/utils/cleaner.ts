export const cleanSpotifyTracks = (tracks: any[]) => {
  const cleanTrackData = (track: any) => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist: any) => artist.name).join(", "),
    albumName: track.album.name,
    albumImage: track.album.images?.[0]?.url || null,
    spotifyUrl: track.external_urls.spotify,
    previewUrl: track.preview_url,
    durationMs: track.duration_ms,
  });

  return tracks.map(cleanTrackData);
};

export const cleanSpotifyArtists = (artists: any[]) => {
  const cleanArtistData = (artist: any) => ({
    id: artist.id,
    image: artist.images?.[0]?.url || null,
    name: artist.name,
    type: artist.type,
  });
  return artists.map(cleanArtistData);
};
