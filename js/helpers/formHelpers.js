/**
 * Created by Roman on 2.7.14.
 */
Lampa.module("Helpers", function (Helpers, Lampa, Backbone, Marionette, $, _) {
    var API = {
        getImageNumberFromPath: function (path) {
            var number = path.replace("images/activity/activity-", "");
            number = number.replace(".svg", "");
            return number;
        },
        toNumber: function (element) {
            return (element === undefined) ? 0 : this.getElementValue(element);
        },
        getElementValue: function (element) {
            try {
                if (element.is(":checkbox")) {
                    return (element.is(":checked")) ? 1 : 0;
                }

                if (element.is("select")) {
                    return _.isNumber(element.val()) ? parseInt(element.val()) : element.val();
                }

                if (element.is("number")) {
                    return parseInt(element.val() * 1);
                }

                var value = element.val();

                if (typeof element.val() == "string") {
                    return element.val().trim();
                }

                return value;
            } catch (ex) {
                console.log(ex.message);
            }
        },
        isChecked: function (state) {
            return (state === 1 || state === "1" || state === true) ? " checked " : "";
        },
        isNotEmpty: function (value) {
            if (!value) {
                return false;
            }
            if (value) {
                if (typeof value === "string") {
                    value = value.trim();
                    if (value === "") {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        replaceNewlinesByBreaks: function (value) {
            if (typeof (value) === "string") {
                return value.replace("\n", "<br/>", "g").trim();
            }

            return value;
        },
        getNameAndDescriptionName: function (name, description) {
            return description === "" ? name : name + " - " + description;
        },
        QueryStringToHash: function (query) {
            var query_string = {};
            var vars = query.split("&");
            var i = 0, length = vars.length;
            for (i; i < length; i++) {
                var pair = vars[i].split("=");
                pair[0] = decodeURIComponent(pair[0]);
                pair[1] = decodeURIComponent(pair[1]);
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    query_string[pair[0]] = [query_string[pair[0]], pair[1]];
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        },
        getOppositeValue: function (value) {
            return !value;
        },
        getschoolTypeDescription: function (value) {
            if (value === 1) return "Independent Teacher";
            if (value === 3) return "Language School";
            return "";
        },
        getCountryName: function (code) {
            var country = {

                "AF": "Afghanistan",
                "AX": "Åland Islands",
                "AL": "Albania",
                "DZ": "Algeria",
                "AS": "American Samoa",
                "AD": "Andorra",
                "AO": "Angola",
                "AI": "Anguilla",
                "AQ": "Antarctica",
                "AG": "Antigua and Barbuda",
                "AR": "Argentina",
                "AM": "Armenia",
                "AW": "Aruba",
                "AU": "Australia",
                "AT": "Austria",
                "AZ": "Azerbaijan",
                "BS": "Bahamas",
                "BH": "Bahrain",
                "BD": "Bangladesh",
                "BB": "Barbados",
                "BY": "Belarus",
                "BE": "Belgium",
                "BZ": "Belize",
                "BJ": "Benin",
                "BM": "Bermuda",
                "BT": "Bhutan",
                "BO": "Bolivia, Plurinational State of",
                "BQ": "Bonaire, Sint Eustatius and Sab",
                "BA": "Bosnia and Herzegovina",
                "BW": "Botswana",
                "BV": "Bouvet Island",
                "BR": "Brazil",
                "IO": "British Indian Ocean Territory",
                "BN": "Brunei Darussalam",
                "BG": "Bulgaria",
                "BF": "Burkina Faso",
                "BI": "Burundi",
                "KH": "Cambodia",
                "CM": "Cameroon",
                "CA": "Canada",
                "CV": "Cape Verde",
                "KY": "Cayman Islands",
                "CF": "Central African Republic",
                "TD": "Chad",
                "CL": "Chile",
                "CN": "China",
                "CX": "Christmas Island",
                "CC": "Cocos (Keeling) Islands",
                "CO": "Colombia",
                "KM": "Comoros",
                "CG": "Congo",
                "CD": "Congo, the Democratic Republic",
                "CK": "Cook Islands",
                "CR": "Costa Rica",
                "CI": "Côte d'Ivoire",
                "HR": "Croatia",
                "CU": "Cuba",
                "CW": "Curaçao",
                "CY": "Cyprus",
                "CZ": "Czech Republic",
                "DK": "Denmark",
                "DJ": "Djibouti",
                "DM": "Dominica",
                "DO": "Dominican Republic",
                "EC": "Ecuador",
                "EG": "Egypt",
                "SV": "El Salvador",
                "GQ": "Equatorial Guinea",
                "ER": "Eritrea",
                "EE": "Estonia",
                "ET": "Ethiopia",
                "FK": "Falkland Islands (Malvinas)",
                "FO": "Faroe Islands",
                "FJ": "Fiji",
                "FI": "Finland",
                "FR": "France",
                "GF": "French Guiana",
                "PF": "French Polynesia",
                "TF": "French Southern Territories",
                "GA": "Gabon",
                "GM": "Gambia",
                "GE": "Georgia",
                "DE": "Germany",
                "GH": "Ghana",
                "GI": "Gibraltar",
                "GR": "Greece",
                "GL": "Greenland",
                "GD": "Grenada",
                "GP": "Guadeloupe",
                "GU": "Guam",
                "GT": "Guatemala",
                "GG": "Guernsey",
                "GN": "Guinea",
                "GW": "Guinea-Bissau",
                "GY": "Guyana",
                "HT": "Haiti",
                "HM": "Heard Island and McDonald Islan",
                "VA": "Holy See (Vatican City State)",
                "HN": "Honduras",
                "HK": "Hong Kong",
                "HU": "Hungary",
                "IS": "Iceland",
                "IN": "India",
                "ID": "Indonesia",
                "IR": "Iran, Islamic Republic of",
                "IQ": "Iraq",
                "IE": "Ireland",
                "IM": "Isle of Man",
                "IL": "Israel",
                "IT": "Italy",
                "JM": "Jamaica",
                "JP": "Japan",
                "JE": "Jersey",
                "JO": "Jordan",
                "KZ": "Kazakhstan",
                "KE": "Kenya",
                "KI": "Kiribati",
                "KP": "Korea, Democratic People's Repu",
                "KR": "Korea, Republic of",
                "KW": "Kuwait",
                "KG": "Kyrgyzstan",
                "LA": "Lao People's Democratic Republi",
                "LV": "Latvia",
                "LB": "Lebanon",
                "LS": "Lesotho",
                "LR": "Liberia",
                "LY": "Libya",
                "LI": "Liechtenstein",
                "LT": "Lithuania",
                "LU": "Luxembourg",
                "MO": "Macao",
                "MK": "Macedonia, the former Yugoslav",
                "MG": "Madagascar",
                "MW": "Malawi",
                "MY": "Malaysia",
                "MV": "Maldives",
                "ML": "Mali",
                "MT": "Malta",
                "MH": "Marshall Islands",
                "MQ": "Martinique",
                "MR": "Mauritania",
                "MU": "Mauritius",
                "YT": "Mayotte",
                "MX": "Mexico",
                "FM": "Micronesia, Federated States of",
                "MD": "Moldova, Republic of",
                "MC": "Monaco",
                "MN": "Mongolia",
                "ME": "Montenegro",
                "MS": "Montserrat",
                "MA": "Morocco",
                "MZ": "Mozambique",
                "MM": "Myanmar",
                "NA": "Namibia",
                "NR": "Nauru",
                "NP": "Nepal",
                "NL": "Netherlands",
                "NC": "New Caledonia",
                "NZ": "New Zealand",
                "NI": "Nicaragua",
                "NE": "Niger",
                "NG": "Nigeria",
                "NU": "Niue",
                "NF": "Norfolk Island",
                "MP": "Northern Mariana Islands",
                "NO": "Norway",
                "OM": "Oman",
                "PK": "Pakistan",
                "PW": "Palau",
                "PS": "Palestinian Territory, Occupied",
                "PA": "Panama",
                "PG": "Papua New Guinea",
                "PY": "Paraguay",
                "PE": "Peru",
                "PH": "Philippines",
                "PN": "Pitcairn",
                "PL": "Poland",
                "PT": "Portugal",
                "PR": "Puerto Rico",
                "QA": "Qatar",
                "RE": "Réunion",
                "RO": "Romania",
                "RU": "Russian Federation",
                "RW": "Rwanda",
                "BL": "Saint Barthélemy",
                "SH": "Saint Helena, Ascension and Tri",
                "KN": "Saint Kitts and Nevis",
                "LC": "Saint Lucia",
                "MF": "Saint Martin (French part)",
                "PM": "Saint Pierre and Miquelon",
                "VC": "Saint Vincent and the Grenadine",
                "WS": "Samoa",
                "SM": "San Marino",
                "ST": "Sao Tome and Principe",
                "SA": "Saudi Arabia",
                "SN": "Senegal",
                "RS": "Serbia",
                "SC": "Seychelles",
                "SL": "Sierra Leone",
                "SG": "Singapore",
                "SX": "Sint Maarten (Dutch part)",
                "SK": "Slovakia",
                "SI": "Slovenia",
                "SB": "Solomon Islands",
                "SO": "Somalia",
                "ZA": "South Africa",
                "GS": "South Georgia and the South San",
                "SS": "South Sudan",
                "ES": "Spain",
                "LK": "Sri Lanka",
                "SD": "Sudan",
                "SR": "Suriname",
                "SJ": "Svalbard and Jan Mayen",
                "SZ": "Swaziland",
                "SE": "Swedenv",
                "CH": "Switzerland",
                "SY": "Syrian Arab Republic",
                "TW": "Taiwan, Province of China",
                "TJ": "Tajikistan",
                "TZ": "Tanzania, United Republic of",
                "TH": "Thailand",
                "TL": "Timor-Leste",
                "TG": "Togo",
                "TK": "Tokelau",
                "TO": "Tonga",
                "TT": "Trinidad and Tobago",
                "TN": "Tunisia",
                "TR": "Turkey",
                "TM": "Turkmenistan",
                "TC": "Turks and Caicos Islands",
                "TV": "Tuvalu",
                "UG": "Uganda",
                "UA": "Ukraine",
                "AE": "United Arab Emirates",
                "GB": "United Kingdom",
                "US": "United States",
                "UM": "United States Minor Outlying Is",
                "UY": "Uruguay",
                "UZ": "Uzbekistan",
                "VU": "Vanuatu",
                "VE": "Venezuela, Bolivarian Republic",
                "VN": "Viet Nam",
                "VG": "Virgin Islands, British",
                "VI": "Virgin Islands, U.S.",
                "WF": "Wallis and Futuna",
                "EH": "Western Sahara",
                "YE": "Yemen",
                "ZM": "Zambia",
                "ZW": "Zimbabwe"
            };
            return country[code];
        },
        getSum: function (collection, column) {
            if (!collection) {
                return 0;
            }

            var sum = 0;
            collection.forEach(function (item) {
                sum += 1 * item.get(column);
            });
            return sum;
        },
        showOrHide: function (status) {
            return status ? "show" : "hidden";
        },
        getSortAndOrder: function (value, key, order) {
            return value === key ? "<span class=\"glyphicon glyphicon-triangle-" + (order === "ascending" ? "top" : "bottom") + "\"></span>" : "";
        }
    };

    Lampa.reqres.setHandler("helper:getImageNumberFromPath", function (path) {
        return API.getImageNumberFromPath(path);
    });

    Lampa.reqres.setHandler("helper:toNumber", function (element) {
        return API.toNumber(element);
    });

    Lampa.reqres.setHandler("helper:getElementValue", function (element) {
        return API.getElementValue(element);
    });

    Lampa.reqres.setHandler("helper:isChecked", function (state) {
        return API.isChecked(state);
    });

    Lampa.reqres.setHandler("helper:showOrHide", function (state) {
        return API.showOrHide(state);
    });

    Lampa.reqres.setHandler("helper:isNotEmpty", function (value) {
        return API.isNotEmpty(value);
    });

    Lampa.reqres.setHandler("helper:getNameAndDescriptionName", function (name, description) {
        return API.getNameAndDescriptionName(name, description);
    });

    Lampa.reqres.setHandler("helper:QueryStringToHash", function (query) {
        return API.QueryStringToHash(query);
    });

    Lampa.reqres.setHandler("helper:getOppositeValue", function (value) {
        return API.getOppositeValue(value);
    });

    Lampa.reqres.setHandler("helper:getschoolTypeDescription", function (value) {
        return API.getschoolTypeDescription(value);
    });

    Lampa.reqres.setHandler("helper:replaceNewlinesByBreaks", function (value) {
        return API.replaceNewlinesByBreaks(value);
    });

    Lampa.reqres.setHandler("helper:getCountryName", function (code) {
        return API.getCountryName(code);
    });

    Lampa.reqres.setHandler("helper:getSum", function (collection, column) {
        return API.getSum(collection, column);
    });

    Lampa.reqres.setHandler("helper:getSortAndOrder", function (value, key, order) {
        return API.getSortAndOrder(value, key, order);
    });
});