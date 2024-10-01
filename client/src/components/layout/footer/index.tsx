import React from "react"
import Image from "next/image"
import Link from "next/link"

import FacebookIcon from "@/assets/svg/socials/facebook.social.svg"
import InstagramIcon from "@/assets/svg/socials/instagram.social.svg"
import TwitterIcon from "@/assets/svg/socials/twitter.social.svg"
import footerData from "@/data/layout.json"

import Logo from "@/components/ui/logo"

interface FooterProps {
  className?: string
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer id="footer" className="">
      <div className="border-y-solid border-y border-y-secondary-white">
        <div className="mx-auto flex w-full flex-col gap-20 px-6 py-10 md:grid md:w-11/12 md:grid-cols-4 md:gap-0">
          <div className="center col-span-3 grow flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="center aspect-square h-48 w-48 grow bg-primary-black">
              <Logo size="lg" className="scale-90 cursor-pointer" theme="light" />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="">ArtLinkup</h2>
              <p className="w-4/5 text-primary-gray/75">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={TwitterIcon}
                  className="cursor-pointer opacity-75 transition-all hover:opacity-100"
                  width={30}
                  height={30}
                  alt=""
                />
                <Image
                  src={InstagramIcon}
                  className="cursor-pointer opacity-75 transition-all hover:opacity-100"
                  width={30}
                  height={30}
                  alt=""
                />
                <Image
                  src={FacebookIcon}
                  className="cursor-pointer opacity-75 transition-all hover:opacity-100"
                  width={30}
                  height={30}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="">
            <h2 className="font-semibold">Features</h2>
            <div className="mt-8 flex w-min flex-col gap-2">
              {footerData.footer.links.map((link) => (
                <Link
                  className="text-lg font-light text-primary-gray/75 transition-all hover:text-primary-gray"
                  key={link.id}
                  href={link.url}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between md:flex-row md:px-6">
        <div className="flex items-center gap-2 px-6 py-4">
          <p className="text-sm text-primary-gray/75">
            © {new Date().getFullYear()} ArtLinkup. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:gap-12">
          <Link href="/legal/privacy-policy" className="text-sm text-primary-gray/75">
            Privacy Policy
          </Link>
          <Link href="/legal/terms-of-service" className="text-sm text-primary-gray/75">
            Terms of Service
          </Link>
          <Link href="/legal/terms-of-service" className="text-sm text-primary-gray/75">
            Refund policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
