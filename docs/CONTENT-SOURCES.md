# Content evidence

Reviewed 22 October 2026. Both attached master prompts had the same SHA-256: `8007930697621366C8F1EA173761106957A1A61ABC862D9AE7B086D2F27B54A9`.

The supplied prompt is the source for identity, contact details, education, achievements, skills and the five initial project descriptions. The destination was empty and not a Git repository. No portrait, resume, screenshots or notebooks were present. LinkedIn was attempted and returned 429; no unavailable profile content was inferred.

## GitHub review

READMEs and recursive source trees were retrieved for each of the following public repositories. Representative implementation paths were also read:

| Repository                                                                                                                | Source checked                                                          | Publication decision                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AMD_Hackathon](https://github.com/hanamaraddi9620adi/AMD_Hackathon)                                                      | README, backend/app/api/v1/endpoints/analyze.py, frontend2/package.json | NAVIA case study; backend credit comes from README, not a commit-level authorship audit. React/Next.js frontend and FastAPI route confirmed.                     |
| [Stock_Market](https://github.com/hanamaraddi9620adi/Stock_Market)                                                        | README, apps/api/app/providers/mock/providers.py                        | QuantEdge case study explicitly labels simulated data; no real-market return claims.                                                                             |
| [swinglens](https://github.com/hanamaraddi9620adi/swinglens)                                                              | README, backend/app/services/analysis_engine.py                         | Small repository link; indicator/pivot code confirmed, runtime not tested.                                                                                       |
| [applybee](https://github.com/hanamaraddi9620adi/applybee)                                                                | README, src/app/api/positioning/route.ts                                | Small repository link; owner-gated generation/storage code confirmed. README demo URL could not be accessed by the browsing tool; no live-demo button published. |
| [CareerForge](https://github.com/hanamaraddi9620adi/AI-Powered-Digital-Commerce-Platform-for-Creators-and-Professionals.) | README, src/app/api/ai/cover-letter/route.ts                            | Repository link only; source checks login, entitlements and input validation. No claim of configured payments/AI or production readiness.                        |
| [LeetCode-Solutions](https://github.com/hanamaraddi9620adi/LeetCode-Solutions)                                            | README, Learning/Bubble_sort.cpp                                        | Classified as ongoing learning, not a production product. No copied progress/performance counters.                                                               |
| [SRKSHome](https://github.com/hanamaraddi9620adi/SRKSHome)                                                                | README, src/app/api/enquiry/route.ts                                    | Repository link; database-backed enquiry route confirmed, deployment not verified.                                                                               |

The public repository inventory was also reviewed. Private repositories are not published or used for claims. No undocumented project association was inferred from a similarly named repository.

House-price prediction uses only the supplied Linear Regression R²=0.6323. MAE/RMSE and Random Forest values remain unpublished. Employee Management, Crypto Profit Calculator and PhishShield AI lack verified public source links in the supplied materials. Their limitations are explicit.

No third-party ThreeUI integration was selected. Consequently no canonical source was copied or represented as verified, and no manifest hashes were claimed. All portfolio visuals are custom code-generated illustrations.

## Implementation documentation consulted

- https://nextjs.org/docs/app/getting-started/installation and installed Next.js 16.4.2 guides for Proxy, redirect, route handlers and authentication.
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/reference/javascript/auth-getuser
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

## Supplied personal photography update

The user subsequently supplied personal photos. The portfolio now uses 1000080354.jpg for the hero, the supplied white-shirt event PNG for the About gallery, and 1000064962 - Copy.jpg as a full-length gallery option. Originals were copied unchanged into public/images; responsive display uses Next Image. No face generation, skin-tone filter, event attribution or 3D reconstruction is claimed. The hero's depth effect is CSS perspective applied to the photo card.

## SwingLens deployment and walkthrough update — 29 October 2026

SwingLens is now a dedicated case study and selected-work card. The user confirmed https://swinglens-cyan.vercel.app/ as the public application URL; it returned HTTP 200 with the SwingLens title and no Vercel login redirect. The initially supplied per-deployment URL redirected to Vercel authentication and is not used as the live-app button.

The user supplied Screen Recording 2026-10-24 123046.mp4. Original size: 527,302,324 bytes. The published H.264/AAC web copy is 11,878,328 bytes at 1280 × 768 and 446.401 seconds, retaining the full timeline and audio. The original remains untouched. The screenshot/poster is captured from the SwingLens interface at 90 seconds. The video is committed as a public portfolio asset with native controls, no autoplay, preload="none", a download link, and a descriptive project overview. No captions or verbatim transcript were supplied or fabricated.
