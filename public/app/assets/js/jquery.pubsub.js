(function($){var topics={};$.subscribe=function(topic,handler){if(!topic||!handler){throw new Error("Topic and handler are required")
}if(!topics.hasOwnProperty(topic)){topics[topic]=$.Callbacks()}topics[topic].add(handler);
return this};$.unsubscribe=function(topic,handler){if(!topics.hasOwnProperty(topic)){throw new Error("Topic "+topic+" doesn't exist")
}var callbacks=topics[topic];if(handler){callbacks.remove(handler);if(!callbacks.has()){delete topics[topic]
}}else{callbacks.empty();delete topics[topic]}return this};$.publish=function(topic,data){if(!topics.hasOwnProperty(topic)){return
}topics[topic].fire(data);return this}})(jQuery);