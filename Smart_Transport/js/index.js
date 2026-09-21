"use strict";

/*
=========================================================
SMART TRANSPORT MANAGEMENT SYSTEM
TRANSLATION SERVICE
=========================================================

Compatible with:

    translate(text, options)

Example:

    const translate = require("./index");

    const result = await translate(
        "Welcome to Smart Transport",
        {
            from: "en",
            to: "hi"
        }
    );

Returns:

{
    text: "...",
    from: {
        language: {
            didYouMean: false,
            iso: "en"
        },
        text: {
            autoCorrected: false,
            value: "",
            didYouMean: false
        }
    },
    raw: ""
}

=========================================================
*/

const querystring =
    require("querystring");

const got =
    require("got");

const token =
    require("google-translate-token");

const languages =
    require("./languages");


/* =========================================================
   TRANSLATE
   ========================================================= */

async function translate(
    text,
    opts = {}
) {

    /*
       Always convert incoming text to a string.
    */

    if (
        text === undefined ||
        text === null
    ) {

        throw createError(
            400,
            "Text is required."
        );

    }


    text =
        String(text);


    if (!text.trim()) {

        return {

            text: "",

            from: {

                language: {

                    didYouMean:
                        false,

                    iso:
                        ""

                },

                text: {

                    autoCorrected:
                        false,

                    value:
                        "",

                    didYouMean:
                        false

                }

            },

            raw:
                ""

        };

    }


    /*
       Validate options.
    */

    opts =
        opts || {};


    const requestedFrom =
        opts.from || "auto";


    const requestedTo =
        opts.to || "en";


    /*
       Check source language.
    */

    if (
        requestedFrom !== "auto" &&
        !languages.isSupported(
            requestedFrom
        )
    ) {

        throw createError(
            400,
            `The language '${requestedFrom}' is not supported.`
        );

    }


    /*
       Check target language.
    */

    if (
        !languages.isSupported(
            requestedTo
        )
    ) {

        throw createError(
            400,
            `The language '${requestedTo}' is not supported.`
        );

    }


    const from =
        languages.getCode(
            requestedFrom
        );


    const to =
        languages.getCode(
            requestedTo
        );


    try {

        /*
           Generate Google Translate token.
        */

        const translateToken =
            await token.get(
                text
            );


        const url =
            "https://translate.google.com/translate_a/single";


        const data = {

            client:
                "t",

            sl:
                from,

            tl:
                to,

            hl:
                to,

            dt: [
                "at",
                "bd",
                "ex",
                "ld",
                "md",
                "qca",
                "rw",
                "rm",
                "ss",
                "t"
            ],

            ie:
                "UTF-8",

            oe:
                "UTF-8",

            otf:
                1,

            ssel:
                0,

            tsel:
                0,

            kc:
                7,

            q:
                text

        };


        data[
            translateToken.name
        ] =
            translateToken.value;


        const requestUrl =
            url +
            "?" +
            querystring.stringify(
                data
            );


        /*
           Request translation.
        */

        const response =
            await got(
                requestUrl,
                {
                    timeout: {
                        request:
                            15000
                    },

                    retry: {
                        limit:
                            1
                    },

                    headers: {

                        "User-Agent":
                            "Mozilla/5.0"

                    }

                }
            );


        if (
            !response ||
            !response.body
        ) {

            throw createError(
                502,
                "Translation service returned an empty response."
            );

        }


        /*
           Google returns a JSON-like
           response.

           JSON.parse is preferred.
           A limited fallback parser is
           used because this endpoint has
           historically returned JavaScript-
           formatted data.
        */

        let body;


        try {

            body =
                JSON.parse(
                    response.body
                );

        } catch (parseError) {

            /*
               Do NOT use safeEval here.

               Extract the translation text
               from the response using the
               expected response structure.
            */

            body =
                parseGoogleTranslationResponse(
                    response.body
                );

        }


        if (
            !Array.isArray(body)
        ) {

            throw createError(
                502,
                "Invalid translation response."
            );

        }


        /*
           Build translated text.
        */

        let translatedText =
            "";


        if (
            Array.isArray(body[0])
        ) {

            body[0].forEach(
                function (segment) {

                    if (
                        Array.isArray(segment) &&
                        segment[0]
                    ) {

                        translatedText +=
                            segment[0];

                    }

                }
            );

        }


        /*
           If no translation was returned,
           use the original text rather
           than displaying a blank page.
        */

        if (
            !translatedText
        ) {

            translatedText =
                text;

        }


        /*
           Determine detected source language.
        */

        let detectedLanguage =
            from;


        let didYouMean =
            false;


        if (
            body[2]
        ) {

            detectedLanguage =
                body[2];

        }


        /*
           Build result compatible with
           the previous module.
        */

        const result = {

            text:
                translatedText,

            from: {

                language: {

                    didYouMean:
                        didYouMean,

                    iso:
                        detectedLanguage ||
                        ""

                },

                text: {

                    autoCorrected:
                        false,

                    value:
                        "",

                    didYouMean:
                        false

                }

            },

            raw:
                opts.raw
                    ? response.body
                    : ""

        };


        /*
           Google sometimes returns
           correction information.
        */

        if (
            body[7] &&
            Array.isArray(body[7]) &&
            body[7][0]
        ) {

            let suggestion =
                String(
                    body[7][0]
                );


            suggestion =
                suggestion
                    .replace(
                        /<b><i>/g,
                        "["
                    )
                    .replace(
                        /<\/i><\/b>/g,
                        "]"
                    );


            result.from.text.value =
                suggestion;


            if (
                body[7][5] === true
            ) {

                result.from.text.autoCorrected =
                    true;

            } else {

                result.from.text.didYouMean =
                    true;

            }

        }


        return result;

    } catch (error) {

        /*
           Preserve already-created
           application errors.
        */

        if (
            error &&
            error.code &&
            (
                error.code ===
                    "BAD_REQUEST" ||

                error.code ===
                    "BAD_NETWORK"
            )
        ) {

            throw error;

        }


        console.error(
            "Translation error:",
            error.message ||
            error
        );


        const translationError =
            new Error(
                "Translation service unavailable."
            );


        /*
           Distinguish HTTP/API failures
           from network failures.
        */

        if (
            error &&
            error.response
        ) {

            translationError.code =
                "BAD_REQUEST";

        } else {

            translationError.code =
                "BAD_NETWORK";

        }


        throw translationError;

    }

}


/* =========================================================
   RESPONSE PARSER
   ========================================================= */

function parseGoogleTranslationResponse(
    rawResponse
) {

    /*
       The normal endpoint returns JSON.
       This fallback only attempts to extract
       translation segments from the expected
       Google response structure.

       It intentionally does not execute
       arbitrary JavaScript.
    */

    const text =
        String(
            rawResponse || ""
        );


    /*
       Try to isolate the first major array.
    */

    const firstArrayStart =
        text.indexOf("[[");


    if (
        firstArrayStart === -1
    ) {

        throw createError(
            502,
            "Unable to parse translation response."
        );

    }


    /*
       Extract strings appearing in the
       first translation segment.

       This is deliberately conservative.
    */

    const matches =
        text.match(
            /\["((?:\\.|[^"\\])*)",/g
        );


    if (
        !matches ||
        matches.length === 0
    ) {

        throw createError(
            502,
            "Unable to parse translated text."
        );

    }


    const segments =
        matches.map(
            function (match) {

                const value =
                    match
                        .replace(
                            /^\["/,
                            ""
                        )
                        .replace(
                            /",$/,
                            ""
                        );


                try {

                    return JSON.parse(
                        `"${value}"`
                    );

                } catch {

                    return value;

                }

            }
        );


    return [

        segments.map(
            function (segment) {

                return [
                    segment
                ];

            }
        )

    ];

}


/* =========================================================
   ERROR HELPER
   ========================================================= */

function createError(
    code,
    message
) {

    const error =
        new Error(
            message
        );


    error.code =
        code;


    return error;

}


/* =========================================================
   EXPORT
   ========================================================= */

module.exports =
    translate;


module.exports.translate =
    translate;


module.exports.languages =
    languages;


console.log(
    "Smart Transport Translation Service Loaded"
);