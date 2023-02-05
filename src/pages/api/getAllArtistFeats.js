import { getArtist, getAllArtistAlbums, getAlbumTracks } from '../../lib/spotify';

export default async function handler(req, res) {
	const artistId = req.body.artistId;

	const artist = await getArtist(artistId);

	const name = artist.name;

	const albums = await getAllArtistAlbums(artistId);

	const feats = [
		//{name: "xyz", track: "xyz", album: "xyz"},
	];

	try {
		for (const album of albums.items) {
			let tracks = await getAlbumTracks(album.id);

			for (const track of tracks.items) {
				for (const artist of track.artists) {
					let isOnTheSong = track.artists.find((artist) => artist.name == name);
					if (isOnTheSong) {
						if (artist.name != name) {
							if (!feats.find((feat) => feat.name == artist.name)) {
								feats.push({ name: artist.name, track: track.name, album: album.name });
							}
						}
					}
				}
			}
		}
	} catch (error) {
		console.log(error);
		res.status(503).send(error);
		return;
	}

	res.json(feats);
}
