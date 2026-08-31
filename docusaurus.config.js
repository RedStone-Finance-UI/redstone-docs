// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes } from "prism-react-renderer";
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "RedStone Documentation",
  tagline: "Documentation for the RedStone protocol",
  url: "https://docs.redstone.finance",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "redstone-finance", // Usually your GitHub org/user name.
  projectName: "redstone-docs", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/redstone-finance/redstone-docs/tree/main",
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: {
            current: {
              label: "Current",
              path: "/",
            },
          },
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
          ],
        },
      }),
    ],
  ],

  scripts: [
    { src: "/js/custom.js", async: true },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "docs",
        logo: {
          alt: "RedStone",
          src: "img/redstone-logo-full.svg",
          srcDark: "img/redstone-logo-white.svg",
          width: "120",
        },
        items: [
          {
            href: "https://github.com/redstone-finance",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      announcementBar: {
        content:
          '<strong>⭐️ If you like RedStone, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/redstone-finance/redstone-oracles-monorepo">GitHub</a> and follow us on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/redstone_defi">Twitter</a> ⭐️</strong>',
        backgroundColor: "#AE0822",
        textColor: "white",
      },
      algolia: {
        appId: "BXXQLGVS3Y",
        apiKey: "3e7ddfe0b2a2ce34495188bd1e433dd4",
        indexName: "redstone",
        contextualSearch: true,
        replaceSearchResultPathname: {
          from: "/next/",
          to: "/",
        },
      },
      footer: {
        style: "light",
        links: [
          {
            title: "We are hiring",
            items: [
              {
                label: "Open Positions",
                href: "https://wellfound.com/company/redstonefinance",
              },
              {
                label: "Our Team",
                href: "https://redstone.finance/team",
              },
            ],
          }
        ],
        copyright: `${new Date().getFullYear()} All Rights Reserved
`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["bash", "solidity", "rust", "toml"],
      },
    }),
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/docs/avs/running-avs-operator",
            to: "/docs/network-tokenomics/restaking-avs/running-avs-operator-testnet",
          },
          {
            from: "/docs/category/restaking-operators-avs",
            to: "/docs/category/restaking--avs/",
          },
          {
            from: "/docs/category/-avs",
            to: "/docs/category/restaking--avs/",
          },
          {
            from: "/docs/redstone-credora/how-to-rate-spark",
            to: "/docs/stage3-risk-intelligence/credora/protocol-implementations/spark-savings/",
          },
          {
            from: "/docs/redstone-credora/how-to-rate-morpho/step-by-step-vault-rating",
            to: "/docs/stage3-risk-intelligence/credora/protocol-implementations/morpho/example-vault/",
          },
          {
            from: "/docs/redstone-credora/methodologies/tokens",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/assets/",
          },

          // docs/architecture
          {
            from: "/docs/architecture",
            to: "/docs/technical-reference/architecture",
          },

          // docs/avs -> docs/network-tokenomics/restaking-avs
          {
            from: "/docs/avs/redstone-avs",
            to: "/docs/network-tokenomics/restaking-avs/redstone-avs",
          },
          {
            from: "/docs/avs/restaking",
            to: "/docs/network-tokenomics/restaking-avs/restaking",
          },
          {
            from: "/docs/avs/rewards",
            to: "/docs/network-tokenomics/restaking-avs/rewards",
          },
          {
            from: "/docs/avs/running-avs-operator-mainnet",
            to: "/docs/network-tokenomics/restaking-avs/running-avs-operator-mainnet",
          },
          {
            from: "/docs/avs/running-avs-operator-testnet",
            to: "/docs/network-tokenomics/restaking-avs/running-avs-operator-testnet",
          },
          {
            from: "/docs/avs/service-components",
            to: "/docs/network-tokenomics/restaking-avs/service-components",
          },

          // docs/token -> docs/network-tokenomics/red-token
          {
            from: "/docs/category/token",
            to: "/docs/category/red-token",
          },
          {
            from: "/docs/token/distribution",
            to: "/docs/network-tokenomics/red-token/distribution",
          },
          {
            from: "/docs/token/supply",
            to: "/docs/network-tokenomics/red-token/supply",
          },
          {
            from: "/docs/token/utility",
            to: "/docs/network-tokenomics/red-token/utility",
          },

          // docs/dapps -> split across stage1-market-data / technical-reference/non-evm-chains
          {
            from: "/docs/category/getting-started",
            to: "/docs/stage1-market-data/overview",
          },
          {
            from: "/docs/dapps/redstone-push",
            to: "/docs/stage1-market-data/price-feeds/push-model",
          },
          {
            from: "/docs/dapps/redstone-pull",
            to: "/docs/stage1-market-data/price-feeds/pull-model",
          },
          {
            from: "/docs/dapps/redstone-erc7412",
            to: "/docs/stage1-market-data/price-feeds/push-model",
          },
          {
            from: "/docs/dapps/redstone-perpetuals",
            to: "/docs/stage1-market-data/live/overview",
          },
          {
            from: "/docs/dapps/redstone-live-feeds",
            to: "/docs/stage1-market-data/live/api-reference",
          },
          {
            from: "/docs/dapps/non-evm",
            to: "/docs/technical-reference/non-evm-chains/overview",
          },
          {
            from: "/docs/dapps/non-evm/radix",
            to: "/docs/technical-reference/non-evm-chains/overview",
          },
          {
            from: "/docs/dapps/non-evm/radix/rust-tutorial",
            to: "/docs/technical-reference/non-evm-chains/overview",
          },
          {
            from: "/docs/dapps/non-evm/radix/typescript-tutorial",
            to: "/docs/technical-reference/non-evm-chains/overview",
          },
          {
            from: "/docs/dapps/non-evm/canton",
            to: "/docs/technical-reference/non-evm-chains/canton",
          },
          {
            from: "/docs/dapps/non-evm/canton/pull-model",
            to: "/docs/technical-reference/non-evm-chains/canton/pull-model",
          },
          {
            from: "/docs/dapps/non-evm/canton/push-model",
            to: "/docs/technical-reference/non-evm-chains/canton/push-model",
          },
          {
            from: "/docs/dapps/non-evm/solana",
            to: "/docs/technical-reference/non-evm-chains/solana",
          },
          {
            from: "/docs/dapps/non-evm/solana/price-adapter",
            to: "/docs/technical-reference/non-evm-chains/solana/price-adapter",
          },
          {
            from: "/docs/dapps/non-evm/solana/price-feed-account",
            to: "/docs/technical-reference/non-evm-chains/solana/price-feed-account",
          },
          {
            from: "/docs/dapps/non-evm/stellar",
            to: "/docs/technical-reference/non-evm-chains/stellar",
          },
          {
            from: "/docs/dapps/non-evm/stellar/rust-tutorial",
            to: "/docs/technical-reference/non-evm-chains/stellar/rust-tutorial",
          },
          {
            from: "/docs/dapps/non-evm/stellar/typescript-tutorial",
            to: "/docs/technical-reference/non-evm-chains/stellar/typescript-tutorial",
          },

          // docs/oev -> docs/stage2-capital-efficiency/atom
          {
            from: "/docs/category/oev",
            to: "/docs/stage2-capital-efficiency/overview",
          },
          {
            from: "/docs/oev/integration",
            to: "/docs/stage2-capital-efficiency/atom/integration-guide",
          },

          // docs/data-providers -> docs/technical-reference/data-providers
          {
            from: "/docs/data-providers/best-practices",
            to: "/docs/technical-reference/data-providers/best-practices",
          },
          {
            from: "/docs/data-providers/deploy",
            to: "/docs/technical-reference/data-providers/deploy",
          },
          {
            from: "/docs/data-providers/introduction",
            to: "/docs/technical-reference/data-providers/introduction",
          },

          // docs/data -> docs/technical-reference/data-quality
          {
            from: "/docs/data/data-flow",
            to: "/docs/technical-reference/data-quality/data-flow",
          },
          {
            from: "/docs/data/data-types",
            to: "/docs/technical-reference/data-quality/data-types",
          },
          {
            from: "/docs/data/lombard",
            to: "/docs/technical-reference/data-quality/lombard-lbtc",
          },

          // docs/security -> docs/technical-reference/security
          {
            from: "/docs/security/architecture",
            to: "/docs/technical-reference/security/security-driven-design",
          },
          {
            from: "/docs/security/audits",
            to: "/docs/technical-reference/security/audits",
          },
          {
            from: "/docs/security/development",
            to: "/docs/technical-reference/security/development-process",
          },
          {
            from: "/docs/security/prevention",
            to: "/docs/technical-reference/security/prevention-monitoring",
          },

          // docs/redstone-credora -> docs/stage3-risk-intelligence/credora
          {
            from: "/docs/redstone-credora",
            to: "/docs/stage3-risk-intelligence/credora/overview",
          },
          {
            from: "/docs/redstone-credora/value-proposition",
            to: "/docs/stage3-risk-intelligence/credora/value-proposition",
          },
          {
            from: "/docs/redstone-credora/faq",
            to: "/docs/stage3-risk-intelligence/credora/faq",
          },
          {
            from: "/docs/redstone-credora/api-documentation",
            to: "/docs/stage3-risk-intelligence/credora/api-documentation",
          },
          {
            from: "/docs/redstone-credora/api-documentation/ratings",
            to: "/docs/stage3-risk-intelligence/credora/api-documentation/ratings",
          },
          {
            from: "/docs/redstone-credora/methodologies",
            to: "/docs/stage3-risk-intelligence/credora/methodologies",
          },
          {
            from: "/docs/redstone-credora/methodologies/assets",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/assets",
          },
          {
            from: "/docs/redstone-credora/methodologies/assets/framework-architecture",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/assets/framework-architecture",
          },
          {
            from: "/docs/redstone-credora/methodologies/assets/framework-architecture/anchor-pd",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/assets/framework-architecture/anchor-pd",
          },
          {
            from: "/docs/redstone-credora/methodologies/assets/framework-architecture/modifiers",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/assets/framework-architecture/modifiers",
          },
          {
            from: "/docs/redstone-credora/methodologies/defi-rating-scale",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/defi-rating-scale",
          },
          {
            from: "/docs/redstone-credora/methodologies/liquidity-pools",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/liquidity-pools",
          },
          {
            from: "/docs/redstone-credora/methodologies/loans_pairs_with",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with",
          },
          {
            from: "/docs/redstone-credora/methodologies/loans_pairs_with/isolated_collateral",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/isolated_collateral",
          },
          {
            from: "/docs/redstone-credora/methodologies/loans_pairs_with/rehypothecated_collateral",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/loans_pairs_with/rehypothecated_collateral",
          },
          {
            from: "/docs/redstone-credora/methodologies/vaults-pools",
            to: "/docs/stage3-risk-intelligence/credora/methodologies/vaults-pools",
          },
          {
            from: "/docs/redstone-credora/protocol-implementations/lista-dao",
            to: "/docs/stage3-risk-intelligence/credora/protocol-implementations/lista-dao",
          },
          {
            from: "/docs/redstone-credora/protocol-implementations/morpho/example-vault",
            to: "/docs/stage3-risk-intelligence/credora/protocol-implementations/morpho/example-vault",
          },
          {
            from: "/docs/redstone-credora/protocol-implementations/spark-savings",
            to: "/docs/stage3-risk-intelligence/credora/protocol-implementations/spark-savings",
          },
        ],
      },
    ],
  ],
};

export default config;