const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')

const ignoreMap = {
  '@emotion/react':
    'https://ga.jspm.io/npm:@emotion/react@11.11.1/dist/emotion-react.browser.esm.js',
  '@emotion/styled':
    'https://ga.jspm.io/npm:@emotion/styled@11.11.0/dist/emotion-styled.browser.esm.js',
  '@mui/joy': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/index.js',
  '@mui/joy/styles': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/styles/index.js',
  react: 'https://ga.jspm.io/npm:react@18.2.0/index.js',
  'react-dom/client': 'https://ga.jspm.io/npm:react-dom@18.2.0/client.js',
  '#AspectRatio': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/AspectRatio/index.js',
  '#AutocompleteListbox':
    'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/AutocompleteListbox/index.js',
  '#AutocompleteOption':
    'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/AutocompleteOption/index.js',
  '#AvatarGroup': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/AvatarGroup/index.js',
  '#Badge': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Badge/index.js',
  '#Breadcrumbs': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Breadcrumbs/index.js',
  '#ButtonGroup': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ButtonGroup/index.js',
  '#CardContent': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/CardContent/index.js',
  '#CardCover': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/CardCover/index.js',
  '#CardOverflow': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/CardOverflow/index.js',
  '#ChipDelete': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ChipDelete/index.js',
  '#CircularProgress': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/CircularProgress/index.js',
  '#Container': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Container/index.js',
  '#FormControl': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/FormControl/index.js',
  '#GlobalStyles': 'https://ga.jspm.io/npm:@mui/styled-engine@5.13.2/GlobalStyles/index.js',
  '#LinearProgress': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/LinearProgress/index.js',
  '#ListItemDecorator': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ListItemDecorator/index.js',
  '#Menu': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Menu/index.js',
  '#MenuItem': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/MenuItem/index.js',
  '#MenuList': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/MenuList/index.js',
  '#Modal': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Modal/index.js',
  '#ModalClose': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ModalClose/index.js',
  '#ModalDialog': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ModalDialog/index.js',
  '#ModalOverflow': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ModalOverflow/index.js',
  '#OptionGroup': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/OptionGroup/index.js',
  '#ScopedCssBaseline': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ScopedCssBaseline/index.js',
  '#Slider': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Slider/index.js',
  '#Snackbar': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Snackbar/index.js',
  '#StyledEngineProvider':
    'https://ga.jspm.io/npm:@mui/styled-engine@5.13.2/StyledEngineProvider/index.js',
  '#Table': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Table/index.js',
  '#className': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/className/index.js',
  '#useList': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useList/index.js',
  '@babel/runtime/helpers/esm/extends':
    'https://ga.jspm.io/npm:@babel/runtime@7.22.5/helpers/esm/extends.js',
  '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose':
    'https://ga.jspm.io/npm:@babel/runtime@7.22.5/helpers/esm/objectWithoutPropertiesLoose.js',
  '@babel/runtime/helpers/extends':
    'https://ga.jspm.io/npm:@babel/runtime@7.22.5/helpers/esm/extends.js',
  '@emotion/cache':
    'https://ga.jspm.io/npm:@emotion/cache@11.11.0/dist/emotion-cache.browser.esm.js',
  '@emotion/hash': 'https://ga.jspm.io/npm:@emotion/hash@0.9.1/dist/emotion-hash.esm.js',
  '@emotion/is-prop-valid':
    'https://ga.jspm.io/npm:@emotion/is-prop-valid@1.2.1/dist/emotion-is-prop-valid.esm.js',
  '@emotion/memoize': 'https://ga.jspm.io/npm:@emotion/memoize@0.8.1/dist/emotion-memoize.esm.js',
  '@emotion/serialize':
    'https://ga.jspm.io/npm:@emotion/serialize@1.1.2/dist/emotion-serialize.browser.esm.js',
  '@emotion/sheet': 'https://ga.jspm.io/npm:@emotion/sheet@1.2.2/dist/emotion-sheet.browser.esm.js',
  '@emotion/unitless':
    'https://ga.jspm.io/npm:@emotion/unitless@0.8.1/dist/emotion-unitless.esm.js',
  '@emotion/use-insertion-effect-with-fallbacks':
    'https://ga.jspm.io/npm:@emotion/use-insertion-effect-with-fallbacks@1.0.1/dist/emotion-use-insertion-effect-with-fallbacks.browser.esm.js',
  '@emotion/utils': 'https://ga.jspm.io/npm:@emotion/utils@1.2.1/dist/emotion-utils.browser.esm.js',
  '@emotion/weak-memoize':
    'https://ga.jspm.io/npm:@emotion/weak-memoize@0.3.1/dist/emotion-weak-memoize.esm.js',
  '@mui/base': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/index.js',
  '@mui/base/Badge': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Badge/index.js',
  '@mui/base/Button': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Button/index.js',
  '@mui/base/ClickAwayListener':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/ClickAwayListener/index.js',
  '@mui/base/FocusTrap': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/FocusTrap/index.js',
  '@mui/base/Input': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Input/index.js',
  '@mui/base/Modal': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Modal/index.js',
  '@mui/base/NoSsr': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/NoSsr/index.js',
  '@mui/base/Option': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Option/index.js',
  '@mui/base/Popper': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Popper/index.js',
  '@mui/base/Portal': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Portal/index.js',
  '@mui/base/Select': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Select/index.js',
  '@mui/base/Slider': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Slider/index.js',
  '@mui/base/Switch': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Switch/index.js',
  '@mui/base/Tab': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Tab/index.js',
  '@mui/base/TabPanel': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/TabPanel/index.js',
  '@mui/base/TablePagination':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/TablePagination/index.js',
  '@mui/base/Tabs': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/Tabs/index.js',
  '@mui/base/TabsList': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/TabsList/index.js',
  '@mui/base/TextareaAutosize':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/TextareaAutosize/index.js',
  '@mui/base/composeClasses':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/composeClasses/index.js',
  '@mui/base/generateUtilityClass':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/generateUtilityClass/index.js',
  '@mui/base/generateUtilityClasses':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/generateUtilityClasses/index.js',
  '@mui/base/useAutocomplete':
    'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useAutocomplete/index.js',
  '@mui/base/useBadge': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useBadge/index.js',
  '@mui/base/useButton': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useButton/index.js',
  '@mui/base/useInput': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useInput/index.js',
  '@mui/base/useMenu': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useMenu/index.js',
  '@mui/base/useMenuItem': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useMenuItem/index.js',
  '@mui/base/useOption': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useOption/index.js',
  '@mui/base/useSelect': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useSelect/index.js',
  '@mui/base/useSlider': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useSlider/index.js',
  '@mui/base/useSnackbar': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useSnackbar/index.js',
  '@mui/base/useSwitch': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useSwitch/index.js',
  '@mui/base/useTab': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useTab/index.js',
  '@mui/base/useTabPanel': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useTabPanel/index.js',
  '@mui/base/useTabs': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useTabs/index.js',
  '@mui/base/useTabsList': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/useTabsList/index.js',
  '@mui/base/utils': 'https://ga.jspm.io/npm:@mui/base@5.0.0-beta.4/utils/index.js',
  '@mui/joy/Alert': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Alert/index.js',
  '@mui/joy/Autocomplete': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Autocomplete/index.js',
  '@mui/joy/Avatar': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Avatar/index.js',
  '@mui/joy/Box': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Box/index.js',
  '@mui/joy/Button': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Button/index.js',
  '@mui/joy/Card': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Card/index.js',
  '@mui/joy/Checkbox': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Checkbox/index.js',
  '@mui/joy/Chip': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Chip/index.js',
  '@mui/joy/CssBaseline': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/CssBaseline/index.js',
  '@mui/joy/Divider': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Divider/index.js',
  '@mui/joy/FormControl': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/FormControl/index.js',
  '@mui/joy/FormHelperText':
    'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/FormHelperText/index.js',
  '@mui/joy/FormLabel': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/FormLabel/index.js',
  '@mui/joy/GlobalStyles': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/GlobalStyles/index.js',
  '@mui/joy/Grid': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Grid/index.js',
  '@mui/joy/IconButton': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/IconButton/index.js',
  '@mui/joy/Input': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Input/index.js',
  '@mui/joy/Link': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Link/index.js',
  '@mui/joy/List': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/List/index.js',
  '@mui/joy/ListDivider': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ListDivider/index.js',
  '@mui/joy/ListItem': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ListItem/index.js',
  '@mui/joy/ListItemButton':
    'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ListItemButton/index.js',
  '@mui/joy/ListItemContent':
    'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ListItemContent/index.js',
  '@mui/joy/ListSubheader': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/ListSubheader/index.js',
  '@mui/joy/Menu': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Menu/index.js',
  '@mui/joy/MenuItem': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/MenuItem/index.js',
  '@mui/joy/Option': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Option/index.js',
  '@mui/joy/Radio': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Radio/index.js',
  '@mui/joy/RadioGroup': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/RadioGroup/index.js',
  '@mui/joy/Select': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Select/index.js',
  '@mui/joy/Sheet': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Sheet/index.js',
  '@mui/joy/Stack': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Stack/index.js',
  '@mui/joy/SvgIcon': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/SvgIcon/index.js',
  '@mui/joy/Switch': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Switch/index.js',
  '@mui/joy/Tab': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Tab/index.js',
  '@mui/joy/TabList': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/TabList/index.js',
  '@mui/joy/TabPanel': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/TabPanel/index.js',
  '@mui/joy/Tabs': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Tabs/index.js',
  '@mui/joy/TextField': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/TextField/index.js',
  '@mui/joy/Textarea': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Textarea/index.js',
  '@mui/joy/Tooltip': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Tooltip/index.js',
  '@mui/joy/Typography': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/Typography/index.js',
  '@mui/joy/colors': 'https://ga.jspm.io/npm:@mui/joy@5.0.0-alpha.84/colors/index.js',
  '@mui/private-theming': 'https://ga.jspm.io/npm:@mui/private-theming@5.13.1/index.js',
  '@mui/private-theming/ThemeProvider':
    'https://ga.jspm.io/npm:@mui/private-theming@5.13.1/ThemeProvider/index.js',
  '@mui/private-theming/useTheme':
    'https://ga.jspm.io/npm:@mui/private-theming@5.13.1/useTheme/index.js',
  '@mui/styled-engine': 'https://ga.jspm.io/npm:@mui/styled-engine@5.13.2/index.js',
  '@mui/system': 'https://ga.jspm.io/npm:@mui/system@5.13.5/esm/index.js',
  '@mui/system/Unstable_Grid':
    'https://ga.jspm.io/npm:@mui/system@5.13.5/esm/Unstable_Grid/index.js',
  '@mui/utils': 'https://ga.jspm.io/npm:@mui/utils@5.13.1/esm/index.js',
  '@popperjs/core': 'https://ga.jspm.io/npm:@popperjs/core@2.11.8/lib/index.js',
  clsx: 'https://ga.jspm.io/npm:clsx@1.2.1/dist/clsx.m.js',
  'hoist-non-react-statics':
    'https://ga.jspm.io/npm:hoist-non-react-statics@3.3.2/dist/hoist-non-react-statics.cjs.js',
  'prop-types': 'https://ga.jspm.io/npm:prop-types@15.8.1/index.js',
  'react-dom': 'https://ga.jspm.io/npm:react-dom@18.2.0/index.js',
  'react-is': 'https://ga.jspm.io/npm:react-is@16.13.1/index.js',
  'react/jsx-runtime': 'https://ga.jspm.io/npm:react@18.2.0/jsx-runtime.js',
  scheduler: 'https://ga.jspm.io/npm:scheduler@0.23.0/index.js',
  stylis: 'https://ga.jspm.io/npm:stylis@4.2.0/index.js',
}

async function jsxCompile(url, source) {
  const transformed = transform(source, {
    presets: [presetReact],
  })

  return transformed.code
}

globalThis.esmsInitOptions = globalThis.esmsInitOptions || {}
globalThis.esmsInitOptions.shimMode = true
globalThis.esmsInitOptions.skip = Object.keys(ignoreMap)
const fetch = globalThis.esmsInitOptions.fetch || globalThis.fetch

globalThis.esmsInitOptions.fetch = async function (url, options) {
  const res = await fetch(url, options)
  if (!res.ok) return res
  const source = await res.text()
  const transformed = await jsxCompile(url, source)
  return new Response(new Blob([transformed], { type: 'application/javascript' }))
}

globalThis.esmsInitOptions.resolve = function (id, parentUrl, defaultResolve) {
  if (ignoreMap[id]) {
    return ignoreMap[id]
  }

  return defaultResolve(id, parentUrl)
}
