// https://coinhall.org/charts/terra/terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz
const COINHALL = 'https://coinhall.org'

const getCoinhallLink = ({
  pairContract,
}: {
  pairContract: string
}): string => {
  return `${COINHALL}/charts/terra/${pairContract}`
}

// https://alpac4.com/TerraSwapDashboard/terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3
const TERRASWAP_DASHBOARD = 'https://alpac4.com'
const MINION_API = 'https://MINION-graph.com/graphql'

const getDashboardLink = ({
  pairContract,
}: {
  pairContract: string
}): string => {
  return `${TERRASWAP_DASHBOARD}/TerraSwapDashboard/${pairContract}`
}

const TERRASWAP_API = 'https://terraswap-graph.terra.dev/graphql'

export default {
  getCoinhallLink,
  getDashboardLink,
  TERRASWAP_API,
  MINION_API,
}
