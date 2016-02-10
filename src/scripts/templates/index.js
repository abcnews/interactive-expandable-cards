module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["row"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " aria-multiselectable=\"true\"";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<a href=\"#ExpandableCards-content--"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"\n            id=\"ExpandableCards-card--"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"\n            class=\"ExpandableCards-card"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.className : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"\n            role=\"tab\"\n            aria-label=\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.titlePrefix : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + alias2(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"\n            aria-controls=\"ExpandableCards-content--"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.titlePrefix : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            <div class=\"ExpandableCards-image\" role=\"presentation\"><img src=\""
    + alias2(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"image","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" /></div>\n            <h3 class=\"ExpandableCards-title\">"
    + alias2(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n            <div class=\"ExpandableCards-more\" role=\"presentation\"></div>\n        </a>"
    + ((stack1 = helpers['if'].call(depth0,(depths[1] != null ? depths[1].isMobile : depths[1]),{"name":"if","hash":{},"fn":this.program(10, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return " ExpandableCards-card--"
    + this.escapeExpression(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"className","hash":{},"data":data}) : helper)));
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return this.escapeExpression(((helper = (helper = helpers.titlePrefix || (depth0 != null ? depth0.titlePrefix : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titlePrefix","hash":{},"data":data}) : helper)))
    + ": ";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "            <div class=\"ExpandableCards-titlePrefix\">"
    + this.escapeExpression(((helper = (helper = helpers.titlePrefix || (depth0 != null ? depth0.titlePrefix : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titlePrefix","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"10":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<div id=\"ExpandableCards-content-"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"\n            class=\"ExpandableCards-content ExpandableCards-content--inline\"\n            role=\"tabpanel\"\n            aria-labelledby=\"ExpandableCards-card--"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"\n            aria-hidden=\"true\"\n            style=\"height: 0\">\n            <div tabindex=\"0\"><article><div class=\"story richtext\"></div></article></div>\n        </div>";
},"12":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(13, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"13":function(depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "    <div id=\"ExpandableCards-content--"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"\n        class=\"ExpandableCards-content ExpandableCards-content--block\"\n        role=\"tabpanel\"\n        aria-labelledby=\"ExpandableCards-card--"
    + alias2(alias1((depths[1] != null ? depths[1].rowId : depths[1]), depth0))
    + "-"
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"\n        aria-hidden=\"true\">\n        <div tabindex=\"0\"><div class=\"article section\"></div></div>\n    </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"ExpandableCards\">\n    <div class=\"ExpandableCards-row\"\n        role=\"tablist\"\n        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isMobile : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n"
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.isMobile : depth0),{"name":"unless","hash":{},"fn":this.program(12, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true});

return this["JST"];

};