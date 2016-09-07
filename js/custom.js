$(document).ready(function() {
    //four slide
    $(".four-slide").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items : 4,
      transitionStyle:"fade",
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3]

    });
    //three slide
    $(".three-slide").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items : 3,
      transitionStyle:"fade",
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3]

    });
    //six slide
    $(".six-slide").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items : 6,
      nav : true,
      transitionStyle:"fade",
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3]

    });

    //smooth scroll
    $(function() {
      $('.scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 800);
            return false;
          }
        }
      });
    });

    //instant search
    $(function() {
      $('#search').keyup(function() {
        var search = $(this).val();
        $.ajax({
          method: 'POST',
          url: '/api/search',
          data: {
            search
          },
          dataType: 'json',
          success: function(json) {
            var data = json.hits.hits.map(function(hit) {
              return hit;
            });

            $('#search_results').empty();
            for (var i = 0; i < data.length; i++) {
              var html = "";
              html += '<div class="col-md-4">';
              html += '<a href="/product/' +  data[i]._source._id + '">';
              html += '<div class="thumbnail">';
              html += '<img src="' + data[i]._source.img  +' ">';
              html += '<div class="caption">';
              html += '<h3>' +  data[i]._source.name + '</h3>';
              html += '<p>' +  data[i]._source.category.name  + '</p>';
              html += '<p>' +  data[i]._source.price  + '</p>';
              html += '</div></di></a></div>';

              $('#search_results').append(html);
            }
            console.log(data);
          },
          error: function(error) {
            console.log(error);
          }
        });
      });

      $(document).on('click', '#plus', function (e) {
        e.preventDefault();
        var priceTotal = parseFloat($('#priceTotal').val());
        var quantity = parseInt($('#quantity').val());

        priceTotal += parseFloat($('#priceHidden').val());
        quantity += 1;

        $('#quantity').val(quantity);
        $('#priceTotal').val(priceTotal);
        $('#priceDisplay').text(priceTotal.toFixed(2));
        $('#total').html(quantity);
      });

      $(document).on('click', '#minus', function (e) {
        e.preventDefault();
        var priceTotal = parseFloat($('#priceTotal').val());
        var quantity = parseInt($('#quantity').val());

        if (quantity == 1) {
          priceTotal = parseFloat($('#priceHidden').val());
          quantity = 1;
        } else {
        priceTotal -= parseFloat($('#priceHidden').val());
        quantity -= 1;
      }

        $('#quantity').val(quantity);
        $('#priceTotal').val(priceTotal);
        $('#priceDisplay').text(priceTotal.toFixed(2));
        $('#total').html(quantity);
      });
    });
});
