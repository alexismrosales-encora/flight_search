import { ThemeProvider } from "@emotion/react"
import CustomTheme from "./themes/theme"
import SearchPage from "./pages/SearchPage"

function App() {
  return (
    <>
      <ThemeProvider theme={CustomTheme}>
        <SearchPage />
      </ThemeProvider>
    </>
  )
}

export default App
