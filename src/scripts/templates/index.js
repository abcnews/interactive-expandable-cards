module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["content"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"ExpandableCards-content\" id=\"ExpandableCards-content--"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div tabindex=\"0\"><div class=\"story richtext article section\"></div></div>\n</div>\n";
},"useData":true});

this["JST"]["root"] = Handlebars.template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=helpers.helperMissing, alias3="function";

  return "<a href=\"#ExpandableCards-content--"
    + alias1(this.lambda((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "\"\n        class=\"ExpandableCards-card"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.className : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.titlePrefix : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n        <div class=\"ExpandableCards-image\" role=\"presentation\"><img src=\""
    + alias1(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"image","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" /></div>\n        <h3 class=\"ExpandableCards-title\">"
    + alias1(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n        <div class=\"ExpandableCards-more\" role=\"presentation\"></div>\n    </a>";
},"2":function(depth0,helpers,partials,data) {
    var helper;

  return " ExpandableCards-card--"
    + this.escapeExpression(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"className","hash":{},"data":data}) : helper)));
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"ExpandableCards-titlePrefix\">"
    + this.escapeExpression(((helper = (helper = helpers.titlePrefix || (depth0 != null ? depth0.titlePrefix : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"titlePrefix","hash":{},"data":data}) : helper)))
    + "</div>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"ExpandableCards\" id=\"ExpandableCards--"
    + this.escapeExpression(this.lambda((depths[1] != null ? depths[1].id : depths[1]), depth0))
    + "\">\n    "
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n";
},"useData":true,"useDepths":true});

return this["JST"];

};