Dice
  = count:Integer "d" sides:IntegerOrPercent options:Option? modifiers:Modifier* explosive:Explosive? {
      return {
        type: 'dice',
        count: count,
        sides: sides,
        modifiers: modifiers,
        options: options,
        explosive: explosive,
      };
    }

Group
  = "(" dice:Dice ")" { return dice; }

Modifier
  = op:("+" / "-" / "/" / "*") value:(Integer / Group) { return { op: op, value: value }; }

Integer
  = digits:[0-9]+ { return parseInt(digits.join(''), 10); }

IntegerOrPercent
  = Integer / "%" { return 100; }

Option
  = "kh" value:Integer { return { type: 'keeph', count: value }; }
  / "kl" value:Integer { return { type: 'keepl', count: value }; }
  / "kc" value:Integer { return { type: 'keepc', count: value }; }
  / "dl" value:Integer { return { type: 'dropl', count: value }; }
  / "dh" value:Integer { return { type: 'droph', count: value }; }
  / "dc" value:Integer { return { type: 'dropc', count: value }; }
  
Explosive
  = "!" { return true; }
  / "" { return false; }

// Parses this:     '10d%dl2+5/2*(3d10kh1!) 10'