const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let token;
let expiresIn;

const getToken = async () => {
	if (token && Date.now() / 1000 < expiresIn) {
		return { access_token: token };
	}

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

	if (!response.ok) console.error('STATUS ERROR: ' + response.status);

	const data = await response.json();

	token = data.access_token;
	expiresIn = Date.now() / 1000 + data.expires_in;

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

	if (!response.ok) console.error('STATUS ERROR: ' + response.status);

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

	if (!response.ok) console.error('STATUS ERROR: ' + response.status);

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

	if (!response.ok) console.error('STATUS ERROR: ' + response.status);

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

	if (!response.ok) console.error('STATUS ERROR: ' + response.status);

	const data = await response.json();
	return data;
};

export { getToken, getArtistRelatedArtists, getArtist, getAllArtistAlbums, getAlbumTracks };
