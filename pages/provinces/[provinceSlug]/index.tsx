import { ContactList } from "../../../components/contact-list";
import { BackButton } from "../../../components/layout/back-button";
import { Page } from "../../../components/layout/page";
import { PageContent } from "../../../components/layout/page-content";
import { PageHeader } from "../../../components/layout/page-header";
import { SearchForm } from "../../../components/search-form";
import { useSearch } from "../../../lib/hooks/use-search";
import provinces, { getProvincesPaths, Province } from "../../../lib/provinces";
import { getTheLastSegmentFromKebabCase } from "../../../lib/string-utils";

import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type ProvinceProps = {
  province: Province;
  provinceSlug: string;
};

export default function ProvincePage(props: ProvinceProps) {
  const { province, provinceSlug } = props;
  const router = useRouter();
  const [filteredContacts, handleSubmitKeywords] = useSearch(
    props.province.data,
    [
      "kebutuhan",
      "penyedia",
      "lokasi",
      "alamat",
      "keterangan",
      "kontak",
      "tautan",
      "tambahan_informasi",
      "bentuk_verifikasi",
    ],
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (province) {
    return (
      <Page>
        <PageHeader
          backButton={<BackButton href="/provinces" />}
          breadcrumbs={[
            {
              name: "Provinsi",
              href: "/provinces",
            },
            {
              name: province.name,
              href: `/provinces/${router.query.provinceSlug}`,
              current: true,
            },
          ]}
          title={`Database for ${province.name}`}
        />
        <PageContent>
          <SearchForm
            itemName="kontak"
            onSubmitKeywords={handleSubmitKeywords}
          />
          <ContactList data={filteredContacts} provinceSlug={provinceSlug} />
        </PageContent>
      </Page>
    );
  } else {
    return (
      <Page>
        <h1>Database not found</h1>
      </Page>
    );
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getProvincesPaths();

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps = ({ params = {} }) => {
  const { provinceSlug } = params;
  const index = getTheLastSegmentFromKebabCase(provinceSlug as string);
  const province = index ? provinces[index as unknown as number] : null;

  return {
    props: {
      province,
      provinceSlug,
    },
  };
};