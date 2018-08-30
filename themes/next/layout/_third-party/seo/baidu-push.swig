{% if theme.baidu_push %}
<script type="text/javascript" src="{{ url_for(theme.js) }}/src/baidu-push.js?v={{ version }}"></script>
{% endif %}