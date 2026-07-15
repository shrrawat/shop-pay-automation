Feature: Shop Pay order creation flow for SFCC website

  @LPOMS-676 @single-line
  Scenario: LPOMS-676 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367369830"
    And I open the product details page for "197367369830"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-686 @single-line @gift-wrap
  Scenario: LPOMS-686 Order creation for a single item with Gift wrap added using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367391145"
    And I open the product details page for "197367391145"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    And I add gift wrap to all products
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-696 @single-line
  Scenario: LPOMS-696 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367391008"
    And I open the product details page for "197367391008"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-699 @multi-line
  Scenario: LPOMS-699 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367333558 | std-item |
      | 197367391145 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-698 @multi-line
  Scenario: LPOMS-698 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367355376 | std-item |
      | 197367391039 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-697 @multi-line
  Scenario: LPOMS-697 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367355413 | std-item |
      | 197367369854 | std-item |
      | 197367376432 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-700 @single-line
  Scenario: LPOMS-700 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367329438"
    And I open the product details page for "197367329438"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-701 @multi-qty @multi-line
  Scenario: LPOMS-701 Order creation for multiple items with multiple quantity using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty |
      | 197367391107 | 2   |
      | 197367356540 | 2   |
      | 197367367928 | 2   |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page


  @LPOMS-703 @multi-line
  Scenario: LPOMS-703 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367318968 | std-item |
      | 197367391114 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-704 @multi-line
  Scenario: LPOMS-704 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367369830 | std-item |
      | 197367253641 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-708 @single-line
  Scenario: LPOMS-708 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367376388"
    And I open the product details page for "197367376388"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-707 @single-line
  Scenario: LPOMS-707 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367376432"
    And I open the product details page for "197367376432"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-711 @single-line
  Scenario: LPOMS-711 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367333640"
    And I open the product details page for "197367333640"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-687 @multi-qty @gwp
  Scenario: LPOMS-687 Order creation for an item with multiple quantity and GWP using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty |
      | 197367333640 | 5   |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-702 @multi-qty
  Scenario: LPOMS-702 Order creation for an item with multiple quantity using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty |
      | 889069971373 | 4   |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-705 @multi-qty
  Scenario: LPOMS-705 Order creation for an item with multiple quantity using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty |
      | 197367356649 | 3   |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-709 @single-line @pre-order
  Scenario: LPOMS-709 Order creation for a single pre order item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367363197"
    And I open the product details page for "197367363197"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-710 @multi-line @pre-order
  Scenario: LPOMS-710 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367333640 | std-item |
      | 197367391039 | std-item |
      | 197367363197 | pre-order|

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-694 @multi-qty @multi-releases
  Scenario: LPOMS-694 Order creation for an item with multiple quantity and multiple releases using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty | allocated to |
      | 197367391053 | 5   | lyons & 800  |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-693 @multi-line @multi-releases
  Scenario: LPOMS-693 Order creation for multiple items and multiple releases using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType | allocated to |
      | 197367349863 | std-item |    lyons     |
      | 197367335125 | std-item |    store     |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-706 @multi-line @disney @agenda @std-item @monogram
  Scenario: LPOMS-706 Order creation for multiple items (Disney, Agenda, STD Item, Monogram) using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType | monogram | monogramText | monogramStyle |
      | 197367373868 | disney   | false    |              |               |
      | 889069823498 | agenda   | false    |              |               |
      | 197367355413 | std-item | false    |              |               |
      | 197367332964 | monogram | true     | LPS          | Triple letter |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-688 @multi-line @ColoradoFee @gwp @OvernightShipping
  Scenario: LPOMS-688 Order creation for multiple items with CO fee, GWP, Overnight shipping using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367333657 | std-item |
      | 197367362459 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I select the Colorado shipping address in the Ship to section on the Pay now popup
    And I select the Overnight shipping method in the Shipping section on the Pay now popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-3688 @multi-line
  Scenario: LPOMS-3688 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367360448 | std-item |
      | 197367359701 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-3689 @multi-line
  Scenario: LPOMS-3689 Order creation for multiple items using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367359510 | std-item |
      | 197367367911 | std-item |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-3690 @multi-qty
  Scenario: LPOMS-3690 Order creation for an item with multiple quantity using Shop pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty |
      | 197367336771 | 3   |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-4586 @single-line
  Scenario: LPOMS-4586 Order creation for a single item using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search for product "197367344325"
    And I open the product details page for "197367344325"
    And I add the product to the tote
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-4587 @multi-qty 
  Scenario: LPOMS-4587 Order creation for an item with multiple quantity using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty |
      | 197367341317 | 5   |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-4580 @multi-line @multi-qty @multi-releases
  Scenario: LPOMS-4580 Order creation for multiple items with multiple quantity and multiple releases using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty | item-type | allocated to |
      | 197367335897 | 1   | std-item  |     store    |
      | 197367244748 | 2   | std-item  |     store    |
      | 197367346299 | 1   | std-item  |     800      |
      | 197367347388 | 1   | std-item  |     800      |
      | 197367362305 | 1   | std-item  |     lyons    |
      | 197367355079 | 1   | std-item  |     store    |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-4583 @multi-line @multi-releases
  Scenario: LPOMS-4583 Order creation for multiple items with multiple releases using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty | item-type | allocated to |
      | 197367378641 | 1   | std-item  |     store    |
      | 197367378603 | 1   | std-item  |     store    |
      | 197367333541 | 1   | std-item  |     800      |
      | 197367333565 | 1   | std-item  |     lyons    |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-4584 @multi-qty @multi-releases
  Scenario: LPOMS-4584 Order creation for multiple items with multiple quantity and multiple releases using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products with quantities to the tote:

      | sku          | qty | item-type | allocated to |
      | 197367378641 | 1   | std-item  |     store    |
      | 197367378603 | 4   | std-item  |     store    |
      | 197367333558 | 2   | std-item  |     800      |
      | 197367333541 | 1   | std-item  |     800      |
      | 197367333565 | 2   | std-item  |     lyons    |

    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page

  @LPOMS-4588 @multi-line @gift-wrap @ColoradoFee @gwp
  Scenario: LPOMS-4588 Order creation for multiple items with Gift wrap, GWP, and Colorado fee added using Shop Pay
    Given I am signed in as a valid customer on the SFCC website
    When I search and add the following products to the tote:

      | sku          | itemType |
      | 197367229585 | std-item |
      | 197367372205 | std-item |
    
    And I proceed to checkout from the mini cart
    Then I should be on the cart page
    And I add gift wrap to all products
    When I open the GWP selection modal if gifts are available
    And I choose available GWP items
    And I add selected GWP gifts to the tote
    And I start Shop Pay checkout
    And I submit my Shop Pay email if prompted
    And I complete captcha and OTP in the Shop Pay popup
    And I select the Colorado shipping address in the Ship to section on the Pay now popup
    And I confirm payment in the Shop Pay popup
    Then I should return to the order confirmation page
