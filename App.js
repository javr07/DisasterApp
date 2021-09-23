// MAIN IMPORTS
import React, { Fragment } from 'react';
import { Provider } from 'mobx-react';
import { StatusBar } from 'expo-status-bar';

// STYLE IMPORTS
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/infrastructure/theme';
import { useFonts as useOswald, Oswald_400Regular } from '@expo-google-fonts/oswald';
import { useFonts as useLato, Lato_400Regular } from '@expo-google-fonts/lato';

// COMPONENTS IMPORTS
import MainAppComponent from './src/components/MainAppComponent';
import { rootStore } from './src/store/RootStore';

// MAIN APP COMPONENT
export default function App() {
	// FONTS
	const [ oswaldLoaded ] = useOswald({
		Oswald_400Regular
	});

	const [ latoLoaded ] = useLato({
		Lato_400Regular
	});

	if (!oswaldLoaded || !latoLoaded) {
		return null;
	}
	

	// MAIN APP JSX
	return (
		<Fragment>
			<Provider rootStore={rootStore}>
				<ThemeProvider theme={theme}>
					<MainAppComponent />
				</ThemeProvider>
			</Provider>
			<StatusBar/>
		</Fragment>
	);
}
