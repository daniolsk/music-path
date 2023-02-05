import { Montserrat } from '@next/font/google';
import '@/styles/globals.css';

const montserrat = Montserrat({
	weight: ['300', '400', '700'],
	subsets: ['latin'],
});

export default function App({ Component, pageProps }) {
	return (
		<>
			<style jsx global>{`
				html {
					font-family: ${montserrat.style.fontFamily};
				}
			`}</style>
			<Component {...pageProps} />
		</>
	);
}
