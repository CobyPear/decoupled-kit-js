import { NextSeo } from "next-seo";
import { sortDate } from "@pantheon-systems/nextjs-kit";
import { isMultiLanguage } from "../lib/isMultiLanguage";
import { getCurrentLocaleStore, globalDrupalStateStores } from "../lib/stores";

import { ArticleGridItem, withGrid } from "../components/grid";
import Image from "next/image";
import Layout from "../components/layout";


export default function HomepageTemplate({
  sortedArticles,
  footerMenu,
  hrefLang,
  multiLanguage,
}) {
  const HomepageHeader = () => (
    <div className="prose sm:prose-xl mt-20 flex flex-col mx-auto max-w-fit">
      <h1 className="prose text-4xl text-center h-full">
        Welcome to{" "}
        <a
          className="text-blue-600 no-underline hover:underline"
          href="https://nextjs.org"
        >
          Next.js!
        </a>
      </h1>

      <div className="text-2xl">
        <div className="bg-black text-white rounded flex items-center justify-center p-4">
          Decoupled Drupal on{" "}
          <Image
            src="/pantheon.png"
            alt="Pantheon Logo"
            width={191}
            height={60}
          />
        </div>
      </div>
    </div>
  );

  const ArticleGrid = withGrid(ArticleGridItem);

  return (
    <Layout footerMenu={footerMenu}>
      <NextSeo
        title="Decoupled Next Drupal Demo"
        description="Generated by create next app."
        languageAlternates={hrefLang || false}
      />
      <>
        <HomepageHeader />
        <section>
          <ArticleGrid
            data={sortedArticles}
            contentType="articles"
            multiLanguage={multiLanguage}
          />
        </section>
      </>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const { locales } = context;
  // if there is more than one language in context.locales,
  // assume multilanguage is enabled.
  const multiLanguage = isMultiLanguage(locales);
  const hrefLang = locales.map((locale) => {
    return {
      hrefLang: locale,
      href: origin + "/" + locale,
    };
  });

  try {
    const store = getCurrentLocaleStore(
      context.locale,
      globalDrupalStateStores
    );

    const articles = await store.getObject({
      objectName: "node--article",
      params: "include=field_media_image.field_media_image",
      refresh: true,
      res: context.res,
    });

    if (!articles) {
      throw new Error(
        "No articles returned. Make sure the objectName and params are valid!"
      );
    }

    const sortedArticles = sortDate({
      data: articles,
      key: "changed",
      direction: "desc",
    });

    const footerMenu = await store.getObject({
      objectName: "menu_items--main",
      refresh: true,
      res: context.res,
    });

    return {
      props: { sortedArticles, hrefLang, multiLanguage, footerMenu },
    };
  } catch (error) {
    console.error("Unable to fetch data for articles page: ", error);
    return {
      notFound: true,
    };
  }
}
