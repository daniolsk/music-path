const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const getToken = async () => {
	let myHeaders = new Headers();
	myHeaders.append('Authorization', 'Basic ' + btoa(clientId + ':' + clientSecret));
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	const urlencoded = new URLSearchParams();
	urlencoded.append('grant_type', 'client_credentials');

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
	});

	const data = await response.json();
	return data;
};

const getArtistRelatedArtists = async (artistId) => {
	const token = await getToken();

	const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			ContentType: 'application/json',
			Authorization: `Bearer ${token.access_token}`,
		},
	});

	const data = await response.json();
	return data;
};

const getArtist = async (artistId) => {
	const token = await getToken();

	const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			ContentType: 'application/json',
			Authorization: `Bearer ${token.access_token}`,
		},
	});

	const data = await response.json();
	return data;
};

const getAllArtistAlbums = async (artistId) => {
	const token = await getToken();

	const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			ContentType: 'application/json',
			Authorization: `Bearer ${token.access_token}`,
		},
	});

	const data = await response.json();
	return data;
};

const getAlbumTracks = async (albumId) => {
	const token = await getToken();

	const response = await fetch(`	https://api.spotify.com/v1/albums/${albumId}/tracks`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			ContentType: 'application/json',
			Authorization: `Bearer ${token.access_token}`,
		},
	});

	const data = await response.json();
	return data;
};

export { getToken, getArtistRelatedArtists, getArtist, getAllArtistAlbums, getAlbumTracks };
