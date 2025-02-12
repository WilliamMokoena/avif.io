import dynamic from "next/dynamic";

//React
import { ChangeEvent, useEffect, useState } from "react";

//Converter
import Conversion from "@components/Home/Conversion";
const DownloadButton = dynamic(() => import("@components/Home/DownloadButton"));
import Dropzone from "@components/Home/Dropzone";
import SettingsBox, { Settings } from "@components/Home/SettingsBox";
import Converter from "@utils/converter";
import { uniqueId } from "@utils/utils";

//Page Layout & Blog
import { InferGetStaticPropsType, NextPage } from "next";
const ReactCompareImage = dynamic(() => import("react-compare-image"));
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { postFilePaths, BLOG_POSTS_PATH } from "@utils/mdx";
import Layout from "@components/Layout";
const Tooltip = dynamic(() => import("@components/Home/Tooltip"));
const Advantages = dynamic(() => import("@components/Home/Advantages"));
const Post = dynamic(() => import("@components/Blog/Post"));
const Ad = dynamic(() => import("@components/Blog/Ad"));

interface FileWithId {
  file: File;
  id: number;
}

const generatePosts = (folderPath: string) =>
  postFilePaths(folderPath).map((filePath: string, index: any) => {
    const source = fs.readFileSync(path.join(folderPath, filePath));
    const { data } = matter(source);

    return {
      index: index,
      description: data.description,
      support: data.support ? data.support : "",
      category: data.category,
      subcategory: data.subcategory ? data.subcategory : "",
      keyword: data.keyword,
      slug: filePath.replace(".mdx", ""),
    };
  });

export const getStaticProps = async () => {
  const tutorials = generatePosts(`${BLOG_POSTS_PATH}/tutorials`);

  const listSubCategories = [
    ...new Set([...tutorials].map((post) => post.subcategory)),
  ].filter(Boolean);

  const listSupport = [
    ...new Set([...tutorials].map((post) => post.support)),
  ].filter(Boolean);

  return {
    props: {
      tutorials,
      listSubCategories,
      listSupport,
    },
  };
};

type PostsPageProps = InferGetStaticPropsType<typeof getStaticProps>;
const Index: NextPage<PostsPageProps> = ({
  tutorials,
  listSupport,
  listSubCategories,
}) => {
  const [filteredPost, setFilteredPost] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("");
  const [image, setImage] = useState("butterfly");
  const [imageSize, setImageSize] = useState("18");
  const [converter, setConverter] = useState<Converter>();
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [settingsBoxOpen, setSettingsBoxOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    effort: 25,
    quality: 75,
    useYuv444: false,
    keepTransparency: true,
    autoDownload: false,
  });

  useEffect(() => setConverter(new Converter()), []);

  function onSettingsUpdate(settings: Settings) {
    setSettings(settings);
  }

  async function onFilesSelected(selectedFiles: File[]) {
    setFiles([
      ...files,
      ...selectedFiles.map((file) => ({ file, id: uniqueId() })),
    ]);
    setSettingsBoxOpen(false);
  }

  function onConversionFinished(file: File) {
    convertedFiles.push(file);
    setConvertedFiles([...convertedFiles]);
  }

  const sliderImages = [
    ["butterfly", "18"],
    ["doggo", "44"],
    ["partyhand", "18"],
    ["party", "60"],
    ["explosion", "23"],
    ["vector", "35"],
  ];

  const sliderButtons = sliderImages.map((item: any, index: any) => (
    <button
      key={index}
      style={{ backgroundImage: `url(/images/${item[0]}.avif)` }}
      className={`mr-2 w-8 h-8 bg-center bg-cover bg-no-repeat ${
        image == item[0] ? "border-4 border-pink-700" : "opacity-50"
      }`}
      onClick={() => {
        setImage(`${item[0]}`);
        setImageSize(`${item[1]}`);
      }}
      name={`avif vs jpg comparison image ${index + 1}: ${item[0]}`}
    />
  ));

  const handleSelectedPill = (category: string) => {
    if (category === selectedCategoryPill) {
      setSelectedCategoryPill("");
      setFilteredPost([]);
      return;
    }

    setSelectedCategoryPill(category);
    const filteredPosts = tutorials.filter((post) => {
      return post.subcategory === category || post.support === category;
    });

    setFilteredPost(filteredPosts as any);
  };

  const handleFilterByKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    const filtered = tutorials.filter((post) =>
      post.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilterKeyword(keyword);
    setFilteredPost(filtered as any);
  };

  const meta = {
    title: "AVIF Converter - unlimited free conversions",
    description:
      "Fastest converter online. Supports bulk. Privacy protected. Convert all image types to AVIF for free.🚀 Compress your images now!⏱",
    url: "",
    datePublished: "2020-09-01",
  };

  const filterTypes = [listSubCategories, listSupport];

  new Promise(() => {
    const image = new Image();
    image.onerror = () => setSupport(false);
    image.onload = () => setSupport(true);
    image.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  }).catch(() => false);

  const [support, setSupport] = useState(false);

  return (
    <Layout meta={meta}>
      <section className="px-2 mt-8 text-center md:px-3 md:mt-12">
        <h1>Convert images to AVIF for free, fast.</h1>
        <div className="block justify-center mb-6 md:flex">
          <h2 className="mt-0 mb-0 text-base font-normal">
            No data is sent. The magic happens in your browser.
          </h2>
          <Tooltip text="How?">
            We use Rav1e, Rust, and WASM to convert your images clientside.
          </Tooltip>
        </div>

        <div
          style={{ width: 720 }}
          data-transition-style="bouncingIn"
          className={
            "relative mx-auto flex flex-col items-center justify-center max-w-full rounded-xl p-0 md:p-4 bg-white bg-opacity-5" +
            (settingsBoxOpen ? " open" : "")
          }
        >
          <Dropzone onDrop={onFilesSelected} />

          <button
            aria-label="Conversion settings"
            className={`absolute top-4 right-4 z-50 block w-5 h-5 p-5 cursor-pointer transition-all transform ease-cog duration-300 bg-no-repeat bg-center invisible md:visible ${
              settingsBoxOpen ? " rotate-180" : "rotate-0"
            }`}
            style={{
              backgroundImage: `url(/assets/settings.svg)`,
              backgroundSize: 24,
              filter: `${
                settingsBoxOpen
                  ? "invert(15%) sepia(52%) saturate(6095%) hue-rotate(348deg) brightness(87%) contrast(88%)"
                  : "none"
              }`,
            }}
            onClick={() => setSettingsBoxOpen(!settingsBoxOpen)}
          ></button>
          <div
            className={
              "absolute top-0 left-full ml-4 w-24 h-auto p-3 bg-bg-400 rounded-md ease-out transform transition-all duration-500 origin-left" +
              (settingsBoxOpen
                ? " opacity-100 translate-x-0 scale-100"
                : " opacity-0 -translate-x-12 scale-0 ")
            }
          >
            <SettingsBox
              open={settingsBoxOpen}
              onSettingsUpdate={onSettingsUpdate}
            />
          </div>

          {converter &&
            files.map(({ file, id }) => (
              <Conversion
                onFinished={onConversionFinished}
                settings={settings}
                file={file}
                converter={converter}
                key={id}
              />
            ))}
          <DownloadButton files={convertedFiles} />
        </div>
      </section>
      <section className="hidden overflow-hidden px-3 mt-12 mb-4 max-w-screen-lg md:block">
        <div
          className="absolute top-0 right-0 bottom-0 left-0 mx-auto w-3/5 rounded-full ease-in-out -z-1 bg-gradient blur-100"
          data-transition-style="glow"
        ></div>
      </section>
      <Advantages />
      {support == true && (
        <section className="container px-2">
          <div className="relative">
            <div className="flex mt-2 mb-2">{sliderButtons}</div>
            <div className="relative">
              <ReactCompareImage
                leftImage={`/images/${image}.avif`}
                rightImage={`/images/${image}.jpg`}
                leftImageAlt="jpg image"
                rightImageAlt="avif image"
                sliderLineWidth={4}
                handle={
                  <div
                    role="button"
                    className="py-4 px-2 bg-pink-700 rounded-xl"
                    tabIndex={0}
                    id="handle"
                  />
                }
                sliderLineColor="rgba(255,255,255,0.2)"
                sliderPositionPercentage={0.5}
              />

              <p
                className="absolute top-4 left-4 py-2 px-3 rounded-md bg-bg-400"
                id="avif"
              >
                {"avif · " + imageSize + "kb"}
              </p>
              <p
                className="absolute top-4 right-4 py-2 px-3 rounded-md bg-bg-400"
                id="jpg"
              >
                {"jpg · " + imageSize + "kb"}
              </p>
            </div>
          </div>
        </section>
      )}
      <aside className="px-2 mx-auto max-w-screen-md">
        <Ad />
      </aside>
      <main className="p-2 md:p-4 archive blog">
        <div className="mt-12 text-center">
          <h3>How to use AVIF</h3>
          <h4 className="m-auto mb-8 max-w-screen-md text-base font-normal">
            Support is constantly rising across software and hardware. Thanks to
            being royalty-free, companies can include the format without having
            to deal with patents. We created articles for you on getting started
            on all different types of browsers, operating systems, and software.
            We didn&apos;t cover your software? Feel free to tell us on
            support@avif.io, and we will write an article about it.
          </h4>
        </div>
        <div className="container px-2">
          <input
            type="text"
            placeholder="🔎︎ Search all posts"
            className="block relative py-3 px-3 pr-10 mt-1 mb-3 w-full text-white rounded-md border-2 outline-none focus:border-pink-700 bg-bg-400 border-bg-500"
            onChange={handleFilterByKeyword}
          />
          {filterTypes.map((type: any, key: any) => (
            <div className="mb-2" key={key}>
              {type.map((category: any) => (
                <button
                  key={category}
                  onClick={() => handleSelectedPill(category)}
                  className={`inline-flex items-center px-2 py-0 mt-2 mr-2 py-0.5 rounded-sm font-normal cursor-pointer ${
                    selectedCategoryPill === category
                      ? "bg-red-1000 border-transparent text-pink-700 hover:bg-indigo-700"
                      : "bg-bg-500 text-gray-300"
                  }`}
                >
                  {selectedCategoryPill === category && (
                    <span className="mr-1">✓</span>
                  )}
                  {category}
                </button>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-1 gap-3 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filterKeyword.length > 0 || filteredPost.length ? (
              <>
                {filteredPost.map((post: any) => (
                  <Post
                    key={post.slug}
                    description={post.description}
                    support={post.support}
                    category={post.category}
                    subcategory={post.subcategory}
                    keyword={post.keyword}
                    slug={post.slug}
                  />
                ))}
              </>
            ) : (
              <>
                {tutorials.map((post: any) => (
                  <Post
                    key={post.slug}
                    description={post.description}
                    support={post.support}
                    category={post.category}
                    subcategory={post.subcategory}
                    keyword={post.keyword}
                    slug={post.slug}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </main>
      <aside className="px-2 mx-auto max-w-screen-md">
        <Ad />
      </aside>
      <div className="container px-2 mt-12 max-w-screen-md text-left md:text-center">
        In the last ten years,{" "}
        <b>
          the size of an average web page has increased from 500 kb to 2000 kb
        </b>
        . Images always take up half the amount. A new image format is needed to
        stop the increasing size of images on the web. JPEG has been the most
        popular image format for years due to its high compatibility.
        <br /> <b>AVIF is the modern solution</b>. It was developed by the
        Alliance for Open Media, a collaboration of Google, Apple, Mozilla,
        Intel and other tech giants. AVIF is a codec for highly compressed
        images of acceptable quality and is constantly improving.{" "}
        <b>
          AVIF offers a significant reduction in file size compared to the
          current JPEG or WebP codecs
        </b>
        .<br /> You can reduce file sizes by 20-90%, even for images with
        transparency and animated frames. Currently supported by Chrome, Opera
        and Firefox, you can expect it to get more support soon.
        <br /> AVIF is being
        <b> developed by the most influential technology companies</b>. Netflix
        has already considered AVIF superior to JPEG and even newer WebP image
        formats in terms of image quality to compressed file size ratio. AV1 has
        been developed by industry leaders and technological innovators from all
        reputable companies. They licensed their codec patents royalty-free to
        create an ecosystem that would last. <br />{" "}
        <b>There is no other codec that seems as promising as AVIF</b>. With its
        widespread support, current feature rate, royalty-free usage and highest
        compression rate achieved, we are only a few steps away from creating a
        truly modern web. avif.io helps to strengthen the support of AVIF by
        providing information, news, resources and an AVIF converter to convert
        PNG to AVIF, JPG to AVIF and more image formats.
        <br />
        Enjoy the free AVIF converter online, convert your images to AVIF today
        and enjoy the amazing compression it provides.
      </div>
    </Layout>
  );
};

export default Index;
