let activeSurveys = [];

/**
 * To make unit test happy
 */
if (typeof(App)==="undefined") {
    App = {};
}

/**
 * Overriding the App.onError function for error handling
 */
App.onError = function(message, sourceURL, line) {
    host.debugLog("TruexTrueTargetingCore.js onError");
    host.debugLog("TruexTrueTargetingCore.js onError message: " + message);
    host.debugLog("TruexTrueTargetingCore.js onError sourceURL: " + sourceURL);
    host.debugLog("TruexTrueTargetingCore.js onError line: " + line);
    TrueTargeting.optOutWithError("Unknown error in Survey.");
};

/**
 * @public
 * @description displays a new survey
 * @param {String} surveyLocation The URL of the TVML to load
 * @param {JSON} macros Values to insert into the TVML template, e.g. survey question
 * @param {String} fallbackTvml Back-up TVML document as a string
 * @returns {undefined}
 */
var showSurvey = function(surveyLocation, macros, fallbackTvml) {
    getDocument(surveyLocation, macros, fallbackTvml);
}

/**
 * @public
 * @description closes all displayed surveys
 * @returns {undefined}
 */
var closeSurvey = function() {
    if (navigationDocument && navigationDocument.documents) {
        activeSurveys.forEach((survey) => {
            if (navigationDocument.documents.includes(survey)) {
                navigationDocument.removeDocument(survey);
            }
        });
    }
    activeSurveys = [];
}

/**
 * @private
 * @description helper function to push new page and remove temp loading screen
 * @param {XMLDocument} page The new page to display
 * @param {XMLDocument} loading The loading page to remove from the view
 * @returns {undefined}
 */
let pushPage = function(page, loading) {
    if (navigationDocument && navigationDocument.documents && navigationDocument.documents.includes(loading)) {
        navigationDocument.replaceDocument(page, loading);
    } else {
        navigationDocument.pushDocument(page);
    }
    activeSurveys.push(page);
}

/**
 * @private
 * @description helper function to create a loading screen document
 * @returns {XMLDocument}
 */
let loadingTemplate = function() {
    const template = "<document><loadingTemplate theme='dark'><activityIndicator><text>Loading</text></activityIndicator></loadingTemplate></document>";
    const templateParser = new DOMParser();
    return templateParser.parseFromString(template, "application/xml");
}

/**
 * @private
 * @description fetches document or fallback and inserts macros
 * @param {String} url URL of the page to load
 * @param {JSON} macros Values to insert into the TVML template, e.g. survey question
 * @param {String} fallbackTvml Back-up TVML document as a string
 * @returns {undefined}
 */
let getDocument = function(url, macros, fallbackXml) {
    const templateXhr = new XMLHttpRequest();
    const loadingScreen = loadingTemplate();
    if (navigationDocument.documents.length > 0) {
        navigationDocument.replaceDocument(loadingScreen, navigationDocument.documents[0]);
    } else {
        navigationDocument.pushDocument(loadingScreen);
    }
    templateXhr.responseType = "document";
    templateXhr.addEventListener("load", function() {
        const responseXml = templateXhr.responseText;
        const modifiedXml = fillTemplate(responseXml, macros);
        pushPage(new DOMParser().parseFromString(modifiedXml, "application/xml"), loadingScreen);
    }, false);

    const showFallback = function() {
        TrueTargeting.trackTrueTargetingShowFallback(url);
        if (fallbackXml && fallbackXml != "") {
            const modifiedFallbackXml = fillTemplate(fallbackXml, macros);
            pushPage(new DOMParser().parseFromString(modifiedFallbackXml, "application/xml"), loadingScreen);
        } else {
            host.debugLog("TruexTrueTargetingCore.js getDocument: Fallback TVML of the follow URL does not exist: " + url);
            TrueTargeting.optOutWithError("Failed to show survey.");
        }
    };

    // Provide fallback if unable to load XML
    templateXhr.addEventListener("error", showFallback, false);

    try {
        templateXhr.open("GET", url, true);
        templateXhr.send();
    } catch (e) {
        showFallback();
    }
}

/**
 * @private
 * @description escapes nested template strings from a string
 *              this allows it to be evaluated for macros while preserving
 *              template strings within it (so they can later be run as JavaScript)
 * @param {String} templateString The raw value of the string to escape
 * @returns {Array<Object>}
 */
let escapeNestedTemplateStrings = function(templateString) {
    const re = new RegExp("`.+?`");
    let mutate = templateString;
    const mapping = new Map();
    let count = 0;
    while (mutate.search(re) >= 0) {
      const match = mutate.match(re)[0];
      const macro = `MACRO${count}`;
      mapping.set(match, macro);
      mutate = mutate.replace(match, macro);
      count++;
    }
    return [mutate, mapping];
}

/**
 * @private
 * @description replace macros with values in a string
 * @param {String} templateString The raw value of the string
 * @param {JSON} macros Values to insert into the TVML template, e.g. survey question
 * @returns {String}
 */
let fillMacrosInString = function(templateString, macros) {
    return new Function("return `" + templateString + "`;").call(macros);
}

/**
 * @private
 * @description re-adds nested template strings that were previously escaped
 *              should be used as a companion method to escapeNestedTemplateStrings()
 * @param {String} mutatedString The string containing escaped templates strings
 * @param {Map} nestedTemplateStringMapping Escaped values mapping to actual nested strings
 * @returns {String}
 */
let reAddNestedTemplateStrings = function(mutatedString, nestedTemplateStringMapping) {
    let mutate = mutatedString;
    nestedTemplateStringMapping.forEach((value, key) => {
      mutate = mutate.replace(value, key);
    });
    return mutate;
}

/**
 * @private
 * @description adds macros to template string, preserving nested template strings
 * @param {String} templateString The raw string with macros
 * @param {JSON} macros The macro values to insert
 * @returns {String}
 */
let fillTemplate = function(templateString, macros) {
    let [mutate, mapping] = escapeNestedTemplateStrings(templateString);

    mutate = fillMacrosInString(mutate, macros)

    mutate = reAddNestedTemplateStrings(mutate, mapping);
    return mutate;
}

// For unit testing purposes:
if (typeof module !== 'undefined') {
    module.exports = {
        showSurvey : showSurvey,
        closeSurvey : closeSurvey,
        getActiveSurveys: () => {
            return activeSurveys;
        },
        pushActiveSurvey: (survey) => {
            activeSurveys.push(survey);
        },
        resetActiveSurveys: () => {
            activeSurveys = [];
        }
    };
}
